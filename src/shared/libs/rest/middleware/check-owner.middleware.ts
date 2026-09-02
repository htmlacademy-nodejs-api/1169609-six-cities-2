import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';

export interface DocumentOwnerService {
  findById(id: string): Promise<{ userId: { toString(): string } } | null>;
}

export class CheckOwnerMiddleware implements Middleware {
  constructor(
    private readonly service: DocumentOwnerService,
    private readonly paramName: string,
  ) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = req.params[this.paramName];
    const userId = req.tokenPayload?.id;

    if (!userId) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'CheckOwnerMiddleware'
      );
    }

    const document = await this.service.findById(documentId);
    if (document?.userId.toString() !== userId) {
      throw new HttpError(
        StatusCodes.FORBIDDEN,
        `User ${userId} is not the owner of document ${documentId}`,
        'CheckOwnerMiddleware'
      );
    }

    return next();
  }
}
