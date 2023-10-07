const validator = require('validator');

const isMobilePhone = (...locale) => {
    return (str) => {
        return validator.isMobilePhone(str, locale)
    } 
}

exports = isMobilePhone;