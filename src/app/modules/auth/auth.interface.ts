export interface ICredentials {
    mobile: string;
    password: string;
}

export interface IChangePassword {
    oldPassword: string;
    newPassword: string;
}

export interface IVerifyOTP {
    _id: string;
    otp: string;
}
