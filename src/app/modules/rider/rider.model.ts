import { Schema, model } from 'mongoose';
import { IAddress, IArea, IRider } from './rider.interface';

const addressSchema = new Schema<IAddress>(
    {
        division: { type: Schema.Types.ObjectId, ref: 'Division' },
        district: { type: Schema.Types.ObjectId, ref: 'District' },
        upazila: { type: Schema.Types.ObjectId, ref: 'Upazila' },
        union: { type: Schema.Types.ObjectId, ref: 'Union' },
        village: { type: Schema.Types.ObjectId, ref: 'Village' },
    },
    { _id: false },
);

const areaSchema = new Schema<IArea>(
    {
        division: { type: Schema.Types.ObjectId, ref: 'Division' },
        district: { type: Schema.Types.ObjectId, ref: 'District' },
        upazila: { type: Schema.Types.ObjectId, ref: 'Upazila' },
        union: { type: Schema.Types.ObjectId, ref: 'Union' },
        village: [{ type: Schema.Types.ObjectId, ref: 'Village' }],
    },
    { _id: false },
);

const riderSchema = new Schema<IRider>(
    {
        // CONTACT INFO
        contactNo1: String,
        contactNo2: String,
        email: String,
        facebookURL: String,
        // ADDRESS INFO
        presentAddress: addressSchema,
        permanentAddress: addressSchema,
        // VEHICLE INFO
        vehicleType: String,
        vehicleBrand: String,
        vehicleModel: String,
        vehicleNumber: String,
        vehicleName: String,
        // OWNER INFO
        ownerName: String,
        ownerAddress: addressSchema,
        ownerMobile: String,
        ownerEmail: String,
        // VEHICLE PHOTOS
        vehiclePhotos: [String],
        // SERVICE INFO
        serviceType: {
            type: String,
            enum: ['ব্যক্তিগত', 'ভাড়ায় চালিত'],
        },
        rentType: {
            type: String,
            enum: [
                'লোকাল ভাড়া',
                'রিজার্ভ ভাড়া',
                'লোকাল ও রিজার্ভ ভাড়া',
                'কন্টাক্ট ভাড়া',
            ],
        },
        mainStation: addressSchema,
        serviceArea: [areaSchema],
        serviceTimeSlots: [
            {
                start: String,
                end: String,
            },
        ],
        serviceStatus: {
            type: String,
            enum: ['off', 'scheduled', 'on'],
            default: 'scheduled',
        },
        // LOCATION INFO
        liveLocation: {
            latitude: Number,
            longitude: Number,
            timestamp: Number,
        },
        manualLocation: {
            latitude: Number,
            longitude: Number,
        },
        // VIDEO URL
        videoURL: String,
        // OTHERS
        id: { type: String, required: true, unique: true },
        user: {
            type: Schema.Types.ObjectId,
            required: true,
            unique: true,
            ref: 'User',
        },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

export const Rider = model<IRider>('Rider', riderSchema);
