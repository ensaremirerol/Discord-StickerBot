exports.useTemplate = (template, data) => {
    data.forEach((el) => template = template.replace("/%VAR%/g", el));
    return template;
}