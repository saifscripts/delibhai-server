exports.generateOTP = (digit) => {
    let otp = '';

    for (let i = 0; i < digit; i++) {
        otp += Math.floor(Math.random() * 10);
    }

    otp = '000000';
    return otp;
};
