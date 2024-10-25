import httpStatus from 'http-status';
import QueryBuilder from '../../builders/QueryBuilder';
import AppError from '../../errors/AppError';
import { IVillage } from './village.interface';
import { Village } from './village.model';

const createVillages = async (villages: IVillage[]) => {
    const existingVillages = await Village.find({
        $or: villages.map((village) => ({
            unionId: village.unionId,
            title: village.title,
        })),
    });

    if (existingVillages.length) {
        throw new AppError(
            httpStatus.CONFLICT,
            'One or more villages already exists!',
        );
    }

    const newVillages = await Village.create(villages);

    if (!newVillages.length) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to create villages',
        );
    }

    return newVillages;
};

const getVillages = async (unionId: string, query: Record<string, unknown>) => {
    const villageQuery = new QueryBuilder(Village.find({ unionId }), query)
        .filter()
        .fields();

    const villages = await villageQuery.modelQuery;

    if (!villages.length) {
        throw new AppError(httpStatus.NOT_FOUND, 'No village found!');
    }

    return villages;
};

export const VillageServices = {
    createVillages,
    getVillages,
};
