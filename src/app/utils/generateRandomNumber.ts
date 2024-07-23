const generateRandomNumber = (digit = 6) => {
    let otp = '';

    for (let i = 0; i < digit; i++) {
        otp += Math.floor(Math.random() * 10);
    }

    return otp;
};

export default generateRandomNumber;
