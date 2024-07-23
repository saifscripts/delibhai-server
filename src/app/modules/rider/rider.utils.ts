import { Rider } from './rider.model';

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
