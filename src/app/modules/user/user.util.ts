import { Rider } from '../rider/rider.model';
import { User } from './user.model';

const findLastRiderId = async () => {
    const lastRider = await Rider.findOne(
        {},
        { id: 1 },
        { getDeletedDocs: true },
    ).sort({
        id: -1,
    });

    return lastRider?.id ? lastRider.id.substring(2) : undefined;
};

export const generateRiderId = async () => {
    const lastRiderId = await findLastRiderId();
    const currentId: number = Number(lastRiderId) || 0;
    const incrementedId: string = (currentId + 1).toString().padStart(6, '0');

    return `DR${incrementedId}`;
};

const findLastInProgressUserId = async () => {
    const lastInProgressUser = await User.findOne(
        { status: 'in-progress' },
        { id: 1 },
        { getDeletedDocs: true },
    ).sort({
        id: -1,
    });

    return lastInProgressUser?.id
        ? lastInProgressUser.id.substring(2)
        : undefined;
};

export const generateInProgressUserId = async () => {
    const lastInProgressUserId = await findLastInProgressUserId();
    const currentId: number = Number(lastInProgressUserId) || 0;
    const incrementedId: string = (currentId + 1).toString().padStart(6, '0');

    return `DX${incrementedId}`;
};

export const generateRandomNumber = (digit = 6) => {
    let otp = '';

    for (let i = 0; i < digit; i++) {
        otp += Math.floor(Math.random() * 10);
    }

    return otp;
};

export const generateExpiryDate = (minutes = 1) => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + minutes);
    return date;
};
