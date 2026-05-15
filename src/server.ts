import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { Pool, Result } from "pg";
import config from "./confing";
const app: Application = express();

//middleware
app.use(express.json());

//pool creation

const pool = new Pool({
  connectionString:config.connection_string,
});

//db connection and create Table

const initDB = async () => {
  try {
    await pool.query(`
            CREATE TABLE IF NOT EXISTS users(
            id SERIAL PRIMARY KEY,
            name VARCHAR(50),
            email VARCHAR(50) UNIQUE NOT NULL,
            password VARCHAR(50) NOT NULL,
            age INT,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
            )
            `);
    console.log("Database Connection Successful");
  } catch (error) {
    console.log(error);
  }
};
initDB();

app.get("/", (req: Request, res: Response) => {
  //res.send('Hello World!')
  res.status(200).json({
    message: "Express Server is running properly",
    Author: "Shaikh Al Nahian",
  });
});

app.post("/users", async (req: Request, res: Response) => {
  const { name, email, password, age } = req.body;
  try {
    const result = await pool.query(
      `
         INSERT INTO users(name,email,password,age) VALUES($1,$2,$3,$4) RETURNING *
        `,
      [name, email, password, age],
    );

    res.status(200).json({
      message: "Data is created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
      error: error,
    });
  }
});

//retrieve all data

app.get("/users", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
            SELECT * FROM users`);

      res.status(200).json({
      message: "Data retrieved successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
      error: error,
    });
  }
});

const port = config.port;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
