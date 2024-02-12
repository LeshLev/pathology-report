import { FileWithPath } from '@mantine/dropzone';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { Patient, ReportResult } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const useUploadReport = () => {
  return useMutation<
    { patient: Patient; abnormalResults: ReportResult[] },
    AxiosError,
    FileWithPath
  >({
    mutationFn: async (file) => {
      const { data } = await axios.post(
        API_URL,
        { file },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Accept: '*/*',
          },
        },
      );

      return data;
    },
    retry: false,
  });
};
