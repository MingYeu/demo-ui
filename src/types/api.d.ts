interface APIResponse<T = undefined> {
    success: boolean;
    message: string;
    data: T;
}

type AuthResponse = {
    success: boolean;
    message: string;
    data: Staff;
    unauthorized: true;
};

interface PaginationResponse<T> extends APIResponse<T> {
    current: number;
    page: number;
    total: number;
    data: T;
}
