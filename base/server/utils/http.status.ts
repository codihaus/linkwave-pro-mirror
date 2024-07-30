import {HttpStatusType} from "../types/http-status.type";

export const SuccessResponseStatus = (data, code = 200, message = "Success"): HttpStatusType => {
    return {
        code: code,
        message: message,
        data: data
    };
};

export const FailedResponseStatus = (options?: {
    code?: number;
    message?: string
    data?: any;
    detail?: any
}): HttpStatusType => {
    return {
        code: options?.code || 401,
        data: options?.data,
        message: options?.message || "Failed",
        detail: options?.detail
    };
};

export const ErrorAuth = (data, code = 401, message = "Unauthorized"): HttpStatusType => {
    return {
        code: code,
        message: message,
        data: {
            ...data
        }
    };
}
