import bodyParser from "body-parser";
import express from "express";
const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const todos = ["Pick Up Groceries", "Walk The Dog"];
const completed = ["Walk The Dog"];

app.get("/api/todo", (_, res) => {
  const todosHtml = `<ul id="todo__list">${todos
    .map((todo) => {
      let style = "";
      if (completed.includes(todo)) style += "text-decoration: line-through;";
      return `<li style="${style}">${todo}</li>`;
    })
    .join("")}</ul>`;
  res.setHeader("Content-Type", "application/json");
  res.send({
    event: "renderTodos",
    todoList: [["replace", "#todo__list", encodeURIComponent(todosHtml)]],
  });
});

app.post("/api/todo", (req, res) => {
  todos.push(req.body.todo);
  console.log(todos);
  res.setHeader("Content-Type", "application/json");
  res.send({
    event: "success",
    appendTodo: [
      ["wait", 2000],
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
