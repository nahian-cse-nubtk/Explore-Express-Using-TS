import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { userRoute } from "./modules/user/user.route";
const app: Application = express();

//middleware
app.use(express.json());


app.get("/", (req: Request, res: Response) => {
  //res.send('Hello World!')
  res.status(200).json({
    message: "Express Server is running properly",
    Author: "Shaikh Al Nahian",
  });
});

app.use("/users", userRoute)

//retrieve all data

//retrieve a single data

//update a specific data based on the id

//delete a data based on the id


export default app;
