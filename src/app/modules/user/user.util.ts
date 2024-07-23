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
