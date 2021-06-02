exports.useTemplate = (template, data) => {
    data.forEach((el) => template.replace("/%VAR%/g", el));
    return template;
}