import bodyParser from "body-parser";
import express from "express";
import tododx from "../client/dx/todo.json" assert { type: "json" };
const app = express();
const port = 3000;

app.use(express.static("client"));
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
  let response = tododx.states.fetchingList["server:success"];
  response[0][2] = encodeURIComponent(todosHtml);
  res.send(response);
});

app.post("/api/todo", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.body.todo === "error") {
    res.send(tododx.states.addingNew["server:error"]);
  } else {
    todos.push(req.body.todo);
    let response = tododx.states.addingNew["server:success"];
    response[0][2] = encodeURIComponent(renderTodoItem(req.body.todo));
    res.send(response);
  }
});

app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
