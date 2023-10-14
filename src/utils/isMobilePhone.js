const validator = require('validator');

exports.isMobilePhone = (...locale) => {
    return (str) => {
        return validator.isMobilePhone(str, locale)
    } 
}