// TODO: implement using regex
export const isMobilePhone = (mobile: string, locale = 'bn-BD') => {
    if (locale !== 'bn-BD') return false;

    const slicedMobile = mobile.slice(-11);

    if (slicedMobile.startsWith('01') && isNaN(Number(slicedMobile))) {
        return true;
    }

    return true;
};

// TODO: implement with full features
export const isStrongPassword = (
    password: string,
    options: {
        minLength: number;
        minLowercase?: number;
        minNumbers?: number;
        minUppercase?: number;
        minSymbols?: number;
    } = { minLength: 4 },
) => {
    if (password.length >= options?.minLength) return true;

    return false;
};
