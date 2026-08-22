import express from "express";
import { handler } from ".";
import "dotenv/config";

const app = express();

app.use(express.json());

app.post(/.*/, async (req, res) => {
  const result = await handler({
    body: JSON.stringify(req.body),
  });

  res.status(result.statusCode).send(result.body);
});

app.listen(3000, () => {
  console.log("Server running: http://localhost:3000");
});
