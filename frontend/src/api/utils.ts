import { AxiosError } from "axios";

/**
 * Handles API errors by extracting meaningful error messages
 * @param err - The error to handle
 * @throws Always throws the extracted error message
 */
export const handleApiError = (err: unknown): never => {
  if (err instanceof AxiosError) {
    throw err.response?.data?.message || err.message;
  } else if (err instanceof Error) {
    throw err.message;
  } else {
    throw String(err);
  }
};
