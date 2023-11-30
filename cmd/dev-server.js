import bodyParser from "body-parser";
import express from "express";
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const todos = ["Pick Up Groceries", "Walk The Dog"];
const completed = ["Walk The Dog"];

function renderTodoItem(todo) {
  let style = "";
  if (completed.includes(todo)) style += "text-decoration: line-through;";
  return `<li class="todo__list__item" style="${style}" data-id="${todo}">${todo}</li>`;
}

app.get("/api/todo", (_, res) => {
  const todosHtml = `<ul id="todo__list">${todos
    .map(renderTodoItem)
    .join("")}</ul>`;
  res.setHeader("Content-Type", "application/json");
  res.send([
    ["replace", "#todo__list", encodeURIComponent(todosHtml)],
    ["dispatch", "success"],
  ]);
});

app.post("/api/todo", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.body.todo === "error") {
    res.send([
      ["attr", "#todo__btn", "disabled", null],
      ["attr", "#todo__input", "disabled", null],
      ["text", "#todo__input__error", "Please enter a todo"],
      ["call", "#todo__input", "focus"],
      ["dispatch", "error"],
    ]);
  } else {
    todos.push(req.body.todo);
    res.send([
      [
        "append",
        "#todo__list",
        encodeURIComponent(renderTodoItem(req.body.todo)),
      ],
      ["attr", "#todo__btn", "disabled", null],
      ["attr", "#todo__input", "disabled", null],
      ["call", "#todo__form", "reset"],
      ["call", "#todo__input", "focus"],
      ["text", "#todo__input__error", ""],
      ["dispatch", "success"],
    ]);
  }
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
