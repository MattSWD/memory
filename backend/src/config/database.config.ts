require("dotenv").config({ path: __dirname + "/./../../.env" });
import { connect, ConnectOptions } from "mongoose";

export const dbConnect = () => {
  connect(process.env.MONGODB_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions).then(
    () => console.log("Connessione al Database stabilita!"),
    (error) => console.log(error)
  );
};
