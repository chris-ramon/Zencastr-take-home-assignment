import { Service } from "./cache/service";
import express from "express";

const app: express.Application = express();

// Enable JSON body parsing.
app.use(express.json());

const port: number = 3000;
const service = new Service();

// Add an item to the cache.
app.post("/cache/add", (req: express.Request, res: express.Response) => {
  const { key, value } = req.body ?? {};
  if (typeof key !== "string" || typeof value !== "string") {
    return res
      .status(400)
      .json({ error: "key and value (both strings) are required" });
  }
  service.add(key, value);
  return res.status(201).json({ key, value });
});

// Handle GET requests in the '/get' path.
app.get("/cache/get", (req: express.Request, res: express.Response) => {
  const { key } = req.body ?? {};
  if (typeof key !== "string") {
    return res.status(400).json({ error: "key (string) is required" });
  }

  const value = service.get(key);
  res.send(value);
});

// Handle POST requests in the '/remove' path.
app.post("/cache/remove", (req: express.Request, res: express.Response) => {
  const { key } = req.body ?? {};
  if (typeof key !== "string") {
    return res.status(400).json({ error: "key (string) is required" });
  }

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
