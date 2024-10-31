const generateExpiryDate = (minutes = 1) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    return date;
};

export default generateExpiryDate;
