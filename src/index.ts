import { Service } from "./cache/service";
import express from "express";

const app: express.Application = express();

// Enable JSON body parsing.
app.use(express.json());

const port: number = 3000;
const service = new Service();

// Handle POST requests in the '/post' path.
app.post("/cache/add", (req: express.Request, res: express.Response) => {
  const body = req.body;
  const { key, value } = body;
  service.add(key, value);
  res.send();
});

// Handle GET requests in the '/get' path.
app.get("/cache/get", (req: express.Request, res: express.Response) => {
  const body = req.body;
  const { key } = body;
  const value = service.get(key);
  res.send(value);
});

// Handle POST requests in the '/remove' path.
app.post("/cache/remove", (req: express.Request, res: express.Response) => {
  const body = req.body;
  const { key } = body;
  service.remove(key);
  res.send();
});

// Handle GET requests in the '/ping' path.
app.get("/ping", (req: express.Request, res: express.Response) => {
  res.send("OK");
});

// Starts the server.
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
