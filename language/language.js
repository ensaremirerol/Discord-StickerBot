exports.useTemplate = (template, data) => {
    data.forEach((el) => template.replace("%VAR%"));
    return template;
}