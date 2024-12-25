import { Types } from 'mongoose';

export interface IAddress {
    division: Types.ObjectId;
    district: Types.ObjectId;
    upazila: Types.ObjectId;
    union: Types.ObjectId;
    village: Types.ObjectId;
}

export interface IArea {
    division: Types.ObjectId;
    district: Types.ObjectId;
    upazila: Types.ObjectId;
    union: Types.ObjectId;
    village: Types.ObjectId[];
}

export interface ITimeSlot {
    start: string;
    end: string;
}

export interface IGeoLocation {
    latitude: number;
    longitude: number;
    timestamp?: number;
}

export interface IRider {
    id: string;
    user: Types.ObjectId;
    contactNo1: string;
    contactNo2: string;
    email: string;
    facebookURL: string;
    presentAddress: IAddress;
    permanentAddress: IAddress;
    vehicleType: string;
    vehicleBrand: string;
    vehicleModel: string;
    vehicleNumber: string;
    vehicleName: string;
    ownerName: string;
    ownerAddress: IAddress;
    ownerContactNo: string;
    ownerEmail: string;
    vehiclePhotos: string[];
    serviceType: 'ব্যক্তিগত' | 'ভাড়ায় চালিত';
    rentType:
        | 'লোকাল ভাড়া'
        | 'রিজার্ভ ভাড়া'
        | 'লোকাল ও রিজার্ভ ভাড়া'
        | 'কন্টাক্ট ভাড়া';
    mainStation: IAddress;
    serviceArea: IArea[];
    serviceTimeSlots: ITimeSlot[];
    serviceStatus: 'off' | 'scheduled' | 'on';
    liveLocation: IGeoLocation;
    manualLocation: IGeoLocation;
    videoURL: string;
    isDeleted: boolean;
}

export interface IRiderFilter {
    vehicleType?: string;
    vehicleSubType?: { $in: string[] };
    role: string;
}
