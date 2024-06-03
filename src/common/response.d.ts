interface ServiceAPIResponse<T> {
    body: T;
    status: number;
    headers?: Object;
    message: string;
}