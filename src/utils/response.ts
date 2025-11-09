import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '@/types';

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    errors: null,
  };
  return res.status(statusCode).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  errors: string[] = [],
  statusCode = 400
): Response => {
  const response: ApiResponse = {
    success: false,
    message,
    errors,
  };
  return res.status(statusCode).json(response);
};

export const sendPaginated = <T>(
  res: Response,
  message: string,
  data: T[],
  pageNumber: number,
  pageSize: number,
  totalSize: number
): Response => {
  const response: PaginatedResponse<T> = {
    success: true,
    message,
    data,
    pageNumber,
    pageSize,
    totalSize,
    errors: null,
  };
  return res.status(200).json(response);
};
