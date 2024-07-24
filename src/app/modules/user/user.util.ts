import { User } from './user.model';

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

export const isNID = (nid: string) => {
    // Check if the NID is a string of 10, 13, or 17 digits
    if (/^\d{10}$|^\d{13}$|^\d{17}$/.test(nid)) {
        if (nid.length === 17) {
            // Extract birth year from the 17-digit NID
            const birthYear = Number(nid.substring(0, 4));

            // Validate the birth year range
            if (!(birthYear >= 1900 && birthYear <= new Date().getFullYear())) {
                return false; // NID is NOT valid (Invalid BirthYear)
            }
        }
        return true; // NID is valid
    }

    return false; // NID is NOT valid
};
