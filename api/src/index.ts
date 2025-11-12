import express from "express";
import dotenv from "dotenv";
import itemsRouter from "./routes/items";

dotenv.config();

const app = express();

app.use(express.json());

// basic health
app.get("/health", (_req, res) => res.json({ status: "ok" }));

app.use("/items", itemsRouter);

// global error handler (simple)
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
