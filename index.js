import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const dataFilePath = path.join(process.cwd(), "data.json");

// Initialize data.json if missing or empty
function initializeData() {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, "[]");
    console.log("data.json created and initialized.");
  } else {
    try {
      const content = fs.readFileSync(dataFilePath, "utf-8");
      if (!content.trim()) {
        fs.writeFileSync(dataFilePath, "[]");
        console.log("data.json was empty and has been initialized.");
      }
    } catch (err) {
      console.error("Error reading data.json:", err);
      fs.writeFileSync(dataFilePath, "[]");
      console.log("data.json reset due to read error.");
    }
  }
}

initializeData();

function readData() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Error reading data.json:", err);
    return [];
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing data.json:", err);
  }
}

// Helper to generate sample vitals
function generateSampleVitals(count = 5) {
  const data = readData();
  const nextId = data.length > 0 ? Math.max(...data.map(d => d.id || 0)) + 1 : 1;

  for (let i = 0; i < count; i++) {
    const newEntry = {
      id: nextId + i,
      bloodPressure: `${Math.floor(Math.random() * 40) + 100}/${Math.floor(Math.random() * 30) + 60}`,
      heartRate: Math.floor(Math.random() * 40) + 60,
      glucose: parseFloat((Math.random() * 4 + 4).toFixed(1)),
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 100000000)).toISOString()
    };
    data.push(newEntry);
  }

  writeData(data);
  return data.slice(-count); // return only the newly added entries
}

// GET all data
app.get("/", (req, res) => {
  res.json(readData());
});

// POST new entry
app.post("/add", (req, res) => {
  const data = readData();
  const nextId = data.length > 0 ? Math.max(...data.map(d => d.id || 0)) + 1 : 1;
  const newEntry = { id: nextId, ...req.body, timestamp: new Date().toISOString() };
  data.push(newEntry);
  writeData(data);
  res.json({ status: "success", added: newEntry });
});

// DELETE entry by ID
app.delete("/delete/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id, 10);
  const filteredData = data.filter(entry => entry.id !== id);
  if (filteredData.length === data.length) {
    return res.status(404).json({ status: "error", message: "ID not found" });
  }
  writeData(filteredData);
  res.json({ status: "success", deletedId: id });
});

// UPDATE entry by ID
app.put("/update/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id, 10);
  let found = false;
  const updatedData = data.map(entry => {
    if (entry.id === id) {
      found = true;
      return { ...entry, ...req.body, timestamp: new Date().toISOString() };
    }
    return entry;
  });
  if (!found) return res.status(404).json({ status: "error", message: "ID not found" });
  writeData(updatedData);
  res.json({ status: "success", updatedId: id });
});

// ROUTE: Generate sample data
app.post("/generate-sample/:count?", (req, res) => {
  const count = parseInt(req.params.count) || 5;
  const newSamples = generateSampleVitals(count);
  res.json({ status: "success", generated: newSamples });
});

app.listen(port, () => console.log(`CloudPad Notes running on port ${port}`));import express from "express";
import fs from "fs";
import path from "path";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const dataFilePath = path.join(process.cwd(), "data.json");

// Initialize data.json if missing or empty
function initializeData() {
  if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, "[]");
    console.log("data.json created and initialized.");
  } else {
    try {
      const content = fs.readFileSync(dataFilePath, "utf-8");
      if (!content.trim()) {
        fs.writeFileSync(dataFilePath, "[]");
        console.log("data.json was empty and has been initialized.");
      }
    } catch (err) {
      console.error("Error reading data.json:", err);
      fs.writeFileSync(dataFilePath, "[]");
      console.log("data.json reset due to read error.");
    }
  }
}

initializeData();

function readData() {
  try {
    const data = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(data || "[]");
  } catch (err) {
    console.error("Error reading data.json:", err);
    return [];
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing data.json:", err);
  }
}

// Helper to generate sample vitals
function generateSampleVitals(count = 5) {
  const data = readData();
  const nextId = data.length > 0 ? Math.max(...data.map(d => d.id || 0)) + 1 : 1;

  for (let i = 0; i < count; i++) {
    const newEntry = {
      id: nextId + i,
      bloodPressure: `${Math.floor(Math.random() * 40) + 100}/${Math.floor(Math.random() * 30) + 60}`,
      heartRate: Math.floor(Math.random() * 40) + 60,
      glucose: parseFloat((Math.random() * 4 + 4).toFixed(1)),
      timestamp: new Date(Date.now() - Math.floor(Math.random() * 100000000)).toISOString()
    };
    data.push(newEntry);
  }

  writeData(data);
  return data.slice(-count); // return only the newly added entries
}

// GET all data
app.get("/", (req, res) => {
  res.json(readData());
});

// POST new entry
app.post("/add", (req, res) => {
  const data = readData();
  const nextId = data.length > 0 ? Math.max(...data.map(d => d.id || 0)) + 1 : 1;
  const newEntry = { id: nextId, ...req.body, timestamp: new Date().toISOString() };
  data.push(newEntry);
  writeData(data);
  res.json({ status: "success", added: newEntry });
});

// DELETE entry by ID
app.delete("/delete/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id, 10);
  const filteredData = data.filter(entry => entry.id !== id);
  if (filteredData.length === data.length) {
    return res.status(404).json({ status: "error", message: "ID not found" });
  }
  writeData(filteredData);
  res.json({ status: "success", deletedId: id });
});

// UPDATE entry by ID
app.put("/update/:id", (req, res) => {
  const data = readData();
  const id = parseInt(req.params.id, 10);
  let found = false;
  const updatedData = data.map(entry => {
    if (entry.id === id) {
      found = true;
      return { ...entry, ...req.body, timestamp: new Date().toISOString() };
    }
    return entry;
  });
  if (!found) return res.status(404).json({ status: "error", message: "ID not found" });
  writeData(updatedData);
  res.json({ status: "success", updatedId: id });
});

// ROUTE: Generate sample data
app.post("/generate-sample/:count?", (req, res) => {
  const count = parseInt(req.params.count) || 5;
  const newSamples = generateSampleVitals(count);
  res.json({ status: "success", generated: newSamples });
});

app.listen(port, () => console.log(`CloudPad Notes running on port ${port}`));
