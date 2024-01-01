import { Hono } from "hono";
import { serveStatic } from "hono/bun";

const app = new Hono();
app.get("/", (c) => c.html(<div>test</div>));
app.use("/static/*", serveStatic({ root: "./src/app/kevinlint.com" }));
app.use(
  "/favicon.ico",
  serveStatic({ path: "./src/app/kevinlint.com/static/images/favicon.svg" })
);

export default app;
