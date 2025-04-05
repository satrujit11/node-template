export { };

declare namespace Express {
  export interface Request {
    userId: string;
    foundDoc: unknown;
  }
}
