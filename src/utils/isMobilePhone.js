const validator = require('validator');

exports.isMobilePhone =
    (...locale) =>
    (str) =>
        validator.isMobilePhone(str, locale);
