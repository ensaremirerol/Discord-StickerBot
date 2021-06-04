const JSZip = require("jszip")
const file = document.getElementById("stikcer");
const resDom = document.getElementById("result");
file.onchange = (data) => {
    if (getFileExtension(data.target.files[0].name) !== ".wastickers") {
        alert("Not a .wastickers file!");
    }
    var zip = new JSZip();
    zip.loadAsync(data.target.files[0])
        .then(function (zip) {
            var promises = Object.keys(zip.files).filter(function (fileName) {
                // don't consider non image files
                return getFileExtension(fileName) === ".webp";
            }).map(function (fileName) {
                var file = zip.files[fileName];
                return file.async("blob").then(function (blob) {
                    return blobToBase64(blob, (result) => {
                        var img = document.createElement("img");
                        var imgBlob = document.createElement("input");
                        var name = document.createElement("input");
                        var br = document.createElement("br");
                        imgBlob.type = "hidden";
                        imgBlob.name = `img${fileName}`;
                        imgBlob.value = result;
                        name.type = "text";
                        name.name = `name${fileName}`;
                        img.src = `data:image/png;base64, ${result}`;
                        name.value = fileName;
                        resDom.append(img);
                        resDom.append(name);
                        resDom.append(imgBlob);
                        resDom.append(br);
                    });

                });
            });
            return Promise.all(promises);
        }, function () {
            alert("Not a .wastickers file!")
        }).then((result) => {
            result.forEach((el) => {

            });
        });

}

const getFileExtension = function (fileName) {
    return fileName.match(/\.[0-9a-z]+$/i)[0];
}


const blobToBase64 = function (blob, callback) {
    var reader = new FileReader();
    reader.onload = function () {
        var dataUrl = reader.result;
        var base64 = dataUrl.split(',')[1];
        return callback(base64);
    };
    reader.readAsDataURL(blob);
};