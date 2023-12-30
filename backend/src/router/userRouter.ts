import * as express from "express";
import { isValidToken } from "../auth/auth";

export const userRouter = express.Router();

userRouter.use((req, res, next) => {
  if (!isValidToken(req.headers.authorization)) {
    return res.sendStatus(401);
  }
  next();
});

userRouter.get("/profile", (req, res) => {
  res.send("you da man now dawg");
});
