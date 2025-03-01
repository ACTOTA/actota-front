import axios from 'axios';
export const getErrorMessage = (error: any): string => {
  console.log(error, 'error from getErrorMessage');
  if (axios.isAxiosError(error)) {
    return String(
      error?.response?.data?.message || error?.response?.data || error?.message
    );
  }
  return String(error?.response?.data?.message ?? error?.response?.data ?? '');
};
