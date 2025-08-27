import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user_id?: string;
}

export interface AuthenticatedRequestWithFile extends AuthenticatedRequest {
  file?: Express.Multer.File;
}