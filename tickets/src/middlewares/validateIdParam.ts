import { type Request, type Response, type NextFunction } from 'express';
import mongoose from 'mongoose';
import { NotFoundError } from '@cwertlinks/common';

export const validateIdParam = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new NotFoundError();
  }
  next();
};
