import { AppDataSource } from "./data-source";
import * as express from "express";
import * as cors from "cors";
import { adminRouter } from "./router/adminRouter";
import { userRouter } from "./router/userRouter";
import { notLoggedInRouter } from "./router/notLoggedInRouter";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path = require("node:path/posix");
import { staffRouter } from "./router/staffRouter";
import { uploadDeckPhoto } from "./controller/draft.controller";
import multer = require("multer");
const upload = multer();

const port = process.env.PORT || 3000;
const app = express();

AppDataSource.initialize()
  .then(async () => {
    AppDataSource.query(
      readFileSync(path.join(__dirname, "..", "db", "markku.sql"), "utf8")
    );

    if (existsSync("/photos")) {
      console.log("writing to volume");
      writeFileSync("/photos/foo.txt", "this is a test");
    }

    app.use(
      cors({
        origin: process.env.FRONTEND_URL,
      })
    );
    app.use(express.json());

    app.get("/", (req, res) => {
      res.send("Hello world, how are you doing");
    });

    app.get("/photos/*", (req, res) => {
      if (existsSync("/photos")) {
        res.sendFile(path.join("/", req.path), {
          headers: {
            "Content-Disposition": "inline",
          },
        });
      } else {
        res.sendFile(path.join(__dirname, "..", "README.md"), {
          headers: {
            "Content-Disposition": "inline",
          },
        });
      }
    });

    app.use(notLoggedInRouter);
    app.use(userRouter);
    app.use(staffRouter);
    app.use(adminRouter);

    app.listen(port, () => {
      console.log("Listening on port", port);
    });
  })
  .catch((error) => console.log(error));
