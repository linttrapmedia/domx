import bodyParser from "body-parser";
import express from "express";
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/todo", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send({
    event: "success",
    dx: [
      [
        "append",
        "#todo__list",
        encodeURIComponent(`<li>${req.body.todo}</li>`),
      ],
    ],
  });
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
