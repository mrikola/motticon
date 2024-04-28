import { AppDataSource } from "./data-source";
import express from "express";
import cors from "cors";
import { adminRouter } from "./router/adminRouter";
import { userRouter } from "./router/userRouter";
import { notLoggedInRouter } from "./router/notLoggedInRouter";
import { existsSync, readFileSync, writeFileSync } from "fs";
import path = require("node:path/posix");
import { staffRouter } from "./router/staffRouter";
import { FILE_ROOT } from "./util/fs";
import errorMiddleware from "./middleware/errorMiddleware";

const port = process.env.PORT || 3000;
const app = express();

AppDataSource.initialize()
  .then(async () => {
    AppDataSource.query(
      readFileSync(path.join(__dirname, "..", "db", "markku.sql"), "utf8")
    );

    if (existsSync(FILE_ROOT)) {
      console.log("writing to volume");
      writeFileSync(`${FILE_ROOT}/foo.txt`, "this is a test");
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

    app.get(`${FILE_ROOT}/*`, (req, res) => {
      if (existsSync(FILE_ROOT)) {
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
    app.use(errorMiddleware);

    app.listen(port, () => {
      console.log("Listening on port", port);
    });
  })
  .catch((error) => console.log(error));
