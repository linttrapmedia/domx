import bodyParser from "body-parser";
import express from "express";
import multer from "multer";
const upload = multer();
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
      ["method", "#todo__form", "reset"],
      ["method", "#todo__input", "focus"],
      ["attr", "#todo__btn", "disabled", null],
      ["attr", "#todo__input", "disabled", null],
      ["wait", 1000],
      ["state", "ready"],
    ],
  });
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
