import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // allow JSON in request body

// Path to your data.json
const dataFilePath = path.join(Deno.cwd(), "data.json");

// Helper: safely read JSON file
function readData() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(data || "[]"); // fallback to empty array if file empty
  } catch (err) {
    console.error("Error reading data.json:", err);
    return []; // fallback to empty array if error
  }
}

// Helper: safely write JSON file
function writeData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing data.json:", err);
  }
}

// GET all data
app.get("/", (req, res) => {
  const data = readData();
  res.json(data);
});

// POST new entry
app.post("/add", (req, res) => {
  const data = readData();
  const newEntry = req.body;
  data.push(newEntry);
  writeData(data);
  res.json({ status: "success", added: newEntry });
});

app.listen(port, () => console.log(`CloudPad Notes running on port ${port}`));
