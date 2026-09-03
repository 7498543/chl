export interface JWTPayload {
  userId: number;
  username: string;
  role: string;
}

declare module "express" {
  interface Request {
    user?: JWTPayload;
  }
}
