exports.isNID = (nid) => {
    // Check if the NID is a string of 10, 13, or 17 digits
    if (/^\d{10}$|^\d{13}$|^\d{17}$/.test(nid)) {
        if (nid.length === 17) {
            // Extract birth year from the 17-digit NID
            const birthYear = parseInt(nid.substr(0, 4), 10);

            // Validate the birth year range
            if (!(birthYear >= 1900 && birthYear <= new Date().getFullYear())) {
                return false; // NID is NOT valid (Invalid BirthYear)
            }
        }
        return true; // NID is valid
    }

    return false; // NID is NOT valid
};
