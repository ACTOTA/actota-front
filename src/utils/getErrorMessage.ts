import axios from 'axios';
export const getErrorMessage = (error: any): string => {
  if (axios.isAxiosError(error)) {
    return String(
      error?.response?.data?.message || error?.response?.data || error?.message
    );
  }
  return String(error?.response?.data?.message ?? error?.response?.data ?? '');
};
