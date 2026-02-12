export interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    countryCode: string;
    countryName: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
}

export interface CustomerRequest {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    countryCode: string;
    countryName: string;
    phoneNumber: string;
}

export interface PageResponse<T> {
    content: T[];
    page: {
        size: number;
        number: number;
        totalElements: number;
        totalPages: number;
    };
}

export interface ApiError {
    message: string;
    errors?: Record<string, string>;
}
