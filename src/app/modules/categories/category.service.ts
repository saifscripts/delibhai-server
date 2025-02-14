import httpStatus from 'http-status';
import QueryBuilder from '../../builders/QueryBuilder';
import AppError from '../../errors/AppError';
import { IVillage } from './category.interface';
import { Village } from './category.model';

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

const updateVillage = async (id: string, payload: Pick<IVillage, 'title'>) => {
    const village = await Village.findById(id);

    if (!village) {
        throw new AppError(httpStatus.NOT_FOUND, 'Village not found!');
    }

    // if the title is same as before, should ignore updating in db
    // THIS IS IMPORTANT to avoid conflict error.
    if (village.title === payload.title) {
        return village;
    }

    // check if same titled village exists with same unionId
    const isVillageExists = await Village.findOne({
        unionId: village.unionId,
        title: payload.title,
    });

    if (isVillageExists) {
        throw new AppError(httpStatus.CONFLICT, 'Village already exists!');
    }

    const updatedVillage = await Village.findByIdAndUpdate(id, payload, {
        new: true,
    });

    if (!updatedVillage) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to update village!',
        );
    }

    return updatedVillage;
};

const deleteVillage = async (id: string) => {
    const deletedVillage = await Village.findByIdAndUpdate(
        id,
        { isDeleted: true },
        {
            new: true,
        },
    );

    if (!deletedVillage) {
        throw new AppError(httpStatus.NOT_FOUND, 'Village not found!');
    }

    return deletedVillage;
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
    updateVillage,
    deleteVillage,
    getVillages,
};
