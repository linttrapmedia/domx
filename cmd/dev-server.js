import fs from "fs";
import http from "http";

const server = http.createServer((req, res) => {
  switch (req.url) {
    case "/":
      const html = fs.readFileSync("./public/index.html", "utf-8");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
      break;
    case "/api/todo":
      switch (req.method) {
        case "POST":
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              event: "success",
              dx: [
                ["attr", "#todo__btn", "disabled", null],
                ["attr", "#todo__input", "disabled", null],
                ["trigger", "#todo__input", "focus"],
                ["append", "#todo_list", "<li>from the backend</li>"],
                ["state", "ready"],
              ],
            })
          );
          break;
      }
      break;
    default:
      const file = fs.readFileSync("./public/" + req.url, "utf-8");
      const ext = req.url.split(".")[1];
      const mime =
        ext === "css"
          ? "text/css"
          : ext === "js"
          ? "text/javascript"
          : ext === "json"
          ? "application/json"
          : "text/plain";
      res.writeHead(200, { "Content-Type": mime });
      res.end(file);
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
});
