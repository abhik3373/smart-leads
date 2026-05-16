import { Response } from 'express';

interface SuccessOptions<T> {
  res: Response;
  statusCode?: number;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
}

export const sendSuccess = <T>({
  res,
  statusCode = 200,
  message = 'Success',
  data,
  meta,
}: SuccessOptions<T>): void => {
  const body: Record<string, unknown> = { success: true, message };
  if (data !== undefined) body.data = data;
  if (meta) body.meta = meta;
  res.status(statusCode).json(body);
};

export const sendError = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: unknown
): void => {
  const body: Record<string, unknown> = { success: false, message };
  if (errors) body.errors = errors;
  res.status(statusCode).json(body);
};