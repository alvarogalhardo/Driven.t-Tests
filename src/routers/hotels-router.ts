import { Router } from "express";

const hotelsRouter = Router();

hotelsRouter.get("/");
hotelsRouter.get("/:hotelId");

export default hotelsRouter;