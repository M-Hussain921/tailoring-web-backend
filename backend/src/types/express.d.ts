import "express";

declare global {
  namespace Express {
    interface Request {
      Admin?: {
        id: string;
        role: string;
      };
    }
  }
}

export {};
