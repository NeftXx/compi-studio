import { Request, Response, NextFunction } from "express";

export function error404(req: Request, res: Response, next: NextFunction) {
  let err = { status: 404, message: "Not Found" };
  next(err);
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.status(err.status || 500);
  res.render("error", { status: err.status, message: err.message });
}
