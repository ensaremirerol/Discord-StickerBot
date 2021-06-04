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
                    return {
                        name: fileName, // keep the link between the file name and the content
                        data: URL.createObjectURL(blob) // create an url. img.src = URL.createObjectURL(...) will work
                    };
                });
            });
            return Promise.all(promises);
        }, function () {
            alert("Not a .wastickers file!")
        }).then((result) => {
            result.forEach((el) => {
                var img = document.createElement("img");
                var imgBlob = document.createElement("input");
                var name = document.createElement("input");
                var br = document.createElement("br");
                imgBlob.type = "hidden";
                imgBlob.name = `img${el.name}`;
                imgBlob.value = el.blob;
                name.type = "text";
                name.name = `name${el.name}`;
                img.src = el.data;
                name.value = el.name;
                resDom.append(img);
                resDom.append(name);
                resDom.append(br);
            });
        });

}

const getFileExtension = function (fileName) {
    return fileName.match(/\.[0-9a-z]+$/i)[0];
}
