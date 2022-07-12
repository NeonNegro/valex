import { Router } from "express";
import { errorHandlerMiddleware } from "../middlewares/errorHandlerMiddleware.js";
import cardRouter from "./cardRouter.js";


const router = Router();

router.use(cardRouter);


router.use(errorHandlerMiddleware);

export default router;