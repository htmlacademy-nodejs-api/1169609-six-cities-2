import { TokenPayload } from './src/shared/modules/auth/index.js';

declare module 'express-serve-static-core' {
  export interface Request {
    tokenPayload: TokenPayload;
    file?: Express.Multer.File;
    files?: Express.Multer.File[];
  }
}
