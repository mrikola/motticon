import { AppDataSource } from "./data-source";
import * as express from "express";
import * as cors from "cors";
import { adminRouter } from "./router/adminRouter";
import { userRouter } from "./router/userRouter";
import { notLoggedInRouter } from "./router/notLoggedInRouter";

const port = process.env.PORT || 3000;
const app = express();

AppDataSource.initialize()
  .then(async () => {
    app.use(express.json());
    app.use(
      cors({
        origin: process.env.FRONTEND_URL,
      })
    );

    // TODO add cors, router, JWT check etc.
    app.get("/", (req, res) => {
      res.send("Hello world, how are you doing");
    });

    app.use(notLoggedInRouter);
    app.use(adminRouter);
    app.use(userRouter);

    app.listen(port, () => {
      console.log("Listening on port", port);
    });
  })
  .catch((error) => console.log(error));
