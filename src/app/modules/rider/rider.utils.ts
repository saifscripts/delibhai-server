import { USER_ROLE } from '../user/user.constant';
import { User } from '../user/user.model';

const findLastRiderId = async () => {
    const lastRider = await User.findOne(
        { role: USER_ROLE.rider, status: { $ne: 'in-progress' } },
        { id: 1 },
        { getDeletedDocs: true },
    ).sort({
        createdAt: -1,
    });

    return lastRider?.id ? lastRider.id.substring(2) : undefined;
};

export const generateRiderId = async () => {
    const lastRiderId = await findLastRiderId();
    const currentId: number = Number(lastRiderId) || 0;
    const incrementedId: string = (currentId + 1).toString().padStart(6, '0');

    return `DR${incrementedId}`;
};

export const calculateTimeInMinutes = (time: string) => {
    const timeArray = time.split(':');

    const hour = Number(timeArray[0]);
    const minute = Number(timeArray[1]);

    return hour * 60 + minute;
};

export const isCurrentTimeWithinServiceTimes = (
    slots: { start: string; end: string }[] = [],
) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    for (const slot of slots) {
        const slotStartMinutes = calculateTimeInMinutes(slot.start);
        const slotEndMinutes = calculateTimeInMinutes(slot.end);

        if (
            currentTimeInMinutes >= slotStartMinutes &&
            currentTimeInMinutes <= slotEndMinutes
        ) {
            return true;
        }
    }

    return false;
};
