import { AppDataSource } from "./data-source";
import * as express from "express";
import * as cors from "cors";
import { adminRouter } from "./router/adminRouter";
import { userRouter } from "./router/userRouter";
import { notLoggedInRouter } from "./router/notLoggedInRouter";
import { readFileSync } from "fs";
import path = require("node:path/posix");

const port = process.env.PORT || 3000;
const app = express();

AppDataSource.initialize()
  .then(async () => {
    AppDataSource.query(
      readFileSync(path.join(__dirname, "..", "db", "markku.sql"), "utf8")
    );

    console.log("allowing origin", process.env.FRONTEND_URL);

    app.use(express.json());
    app.use(
      cors({
        origin: process.env.FRONTEND_URL,
      })
    );

    app.get("/", (req, res) => {
      res.send("Hello world, how are you doing");
    });

    app.use(notLoggedInRouter);
    app.use(userRouter);
    app.use(adminRouter);

    app.listen(port, () => {
      console.log("Listening on port", port);
    });
  })
  .catch((error) => console.log(error));
