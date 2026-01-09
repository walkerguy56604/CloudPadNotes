app.use(express.json());

app.post("/log", (req, res) => {
  const { type, value, timestamp } = req.body;
  // For now, just send it back
  res.json({ status: "success", type, value, timestamp });
});
