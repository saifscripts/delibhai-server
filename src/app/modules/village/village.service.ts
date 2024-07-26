import httpStatus from 'http-status';
import QueryBuilder from '../../builders/QueryBuilder';
import AppError from '../../errors/AppError';
import { Village } from './village.model';

const getVillagesFromDB = async (query: Record<string, unknown>) => {
    const villageQuery = new QueryBuilder(Village.find(), query)
        .filter()
        .fields();

    const villages = await villageQuery.modelQuery;

    if (!villages.length) {
        throw new AppError(httpStatus.NOT_FOUND, 'No villages found!');
    }

    return villages;
};

export const VillageServices = {
    getVillagesFromDB,
};
