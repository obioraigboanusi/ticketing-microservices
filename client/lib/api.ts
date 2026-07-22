import axios, { AxiosError } from 'axios';

export const api = axios.create({
  baseURL: '/',
  withCredentials: true,
});

export interface ApiFieldError {
  message: string;
  field?: string;
}

interface ApiErrorResponse {
  errors: ApiFieldError[];
}

function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    Array.isArray((data as ApiErrorResponse).errors)
  );
}


// render consistent messages regardless of network vs. validation failures.
export function extractApiErrors(err: unknown): ApiFieldError[] {
  if (err instanceof AxiosError) {
    if (isApiErrorResponse(err.response?.data)) {
      return err.response.data.errors;
    }
    return [{ message: err.message || 'Request failed' }];
  }

  if (err instanceof Error) {
    return [{ message: err.message }];
  }

  return [{ message: 'Something went wrong' }];
}
