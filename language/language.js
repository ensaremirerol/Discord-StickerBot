exports.useTemplate = (template, data) => {
    data.forEach((el) => template = template.replace("%VAR%", el));
    return template;
}