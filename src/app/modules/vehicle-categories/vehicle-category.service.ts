import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { IVehicleCategory } from './vehicle-category.interface';
import { VehicleCategory } from './vehicle-category.model';
import { createSlug, generateCategoryOrder } from './vehicle-category.utils';

const createVehicleCategory = async (payload: IVehicleCategory) => {
    const newCategory = await VehicleCategory.create({
        ...payload,
        slug: payload.slug || createSlug(payload.title_en),
        order: await generateCategoryOrder(),
    });

    if (!newCategory) {
        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to create Vehicle Category',
        );
    }

    return newCategory;
};

// const updateVehicleCategory = async (
//     id: string,
//     payload: Partial<IVehicleCategory>,
// ) => {};

// const deleteVehicleCategory = async (id: string) => {};

// const getVehicleCategories = async (query: Record<string, unknown>) => {};

export const VehicleCategoryServices = {
    createVehicleCategory,
    // updateVehicleCategory,
    // deleteVehicleCategory,
    // getVehicleCategories,
};
