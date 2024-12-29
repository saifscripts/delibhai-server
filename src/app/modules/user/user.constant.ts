export const USER_ROLE = {
    admin: 'admin',
    rider: 'rider',
} as const;

export const SERVICE_STATUS = {
    on: 'on',
    scheduled: 'scheduled',
    off: 'off',
    deactivated: 'deactivated',
} as const;

export const ServiceStatus = ['on', 'scheduled', 'off', 'deactivated'] as const;
export const RentType = ['লোকাল', 'রিজার্ভ', 'কন্টাক্ট'] as const;
