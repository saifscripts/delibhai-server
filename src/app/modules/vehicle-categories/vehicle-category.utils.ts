import slugify from 'slugify';
import { VehicleCategory } from './vehicle-category.model';

export const createSlug = (value: string) =>
    slugify(value, {
        lower: true,
        strict: true,
        trim: true,
    });

export const generateCategoryOrder = async () => {
    const lastCategory = await VehicleCategory.findOne(
        {},
        { order: 1 },
        { getAll: true },
    ).sort({
        order: -1,
    });

    return lastCategory ? lastCategory.order + 1 : 0;
};
