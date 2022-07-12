import { Router } from "express";



const cardRouter = Router();

cardRouter.post("/card", createCard);
cardRouter.get("/card", getCard);

export default cardRouter;