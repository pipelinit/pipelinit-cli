const express = require("express");

const app = express();

const port = 4000;

app.get("/", (res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
