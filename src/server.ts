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
  connectionString: config.connection_string,
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
//retrieve a single data
app.get("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `
            SELECT * FROM users WHERE id = $1
 `,
      [id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Data Not Found",
        data: null,
      });
    }
    res.status(200).json({
      message: "Data retrieved successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(404).json({
      message: error.message,
      error: error,
    });
  }
});
app.put("/users/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password, age } = req.body;
  try {
    const result = await pool.query(
      `
            UPDATE users SET
            name=COALESCE($1,name)
            password= COALESCE($3,password)
            age=COALESCE($4,age) WHERE id =$5 RETURNING *
            `,
      [name, email, password, age, id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Data Not Found",
        data: null,
      });
    }
    res.status(200).json({
        success: true,
        message:"Update successful",
        data:result.rows[0]
    })
  } catch (error: any) {
    res.status(500).json({
      message: error.message,
      error: error,
    });
  }
});
const port = config.port;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
