import { HttpError } from 'react-admin';
export declare class NotImplementedError extends Error {
    constructor(message: string);
}
export declare class SafrsHttpError extends HttpError {
    constructor(message: string, status: number, body: any);
}
export declare const safrsErrorHandler: HttpErrorHandler;
export interface HttpErrorHandler {
    (httpError: HttpError): HttpError;
}
