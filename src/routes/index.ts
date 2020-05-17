import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.render("index", { page: "Inicio" });
});

router.get("/gramatica", (req: Request, res: Response) => {
  res.render("gramatica", { page: "Gramatica" });
});

export default router;
