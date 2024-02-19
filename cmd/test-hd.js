import esbuild from "esbuild";
import fs from "fs";
import jsdom from "jsdom";
import colors from "./util/colors.js";
const { JSDOM } = jsdom;
const watch = process.argv[2] === "--watch" ? true : false;
const isDebugging = process.env.NODE_INSPECT_RESUME_ON_START === "1";
let failures = "";

// compile code
const unitTestCode = esbuild.buildSync({
  bundle: true,
  define: {
    "process.env.NODE_ENV": '"production"',
    "process.argv": JSON.stringify(process.argv) ?? `[]`,
  },
  entryNames: `unit`,
  entryPoints: ["test/unit.ts"],
  globalName: "domx",
  minify: !isDebugging,
  outdir: "test",
  platform: "browser",
  sourcemap: false,
  target: ["esnext"],
  treeShaking: true,
  watch: watch,
  write: watch,
}).outputFiles[0].text;

fs.writeFileSync(
  "./test/results/unit.html",
  `<html>
    <head>
      <title>DOMX Unit Tests</title>
      <script>${unitTestCode}</script>
    </head>
    <body>
      <div id="test-results"></div>
      <div id="test-sandbox"></div>
    </body>
  </html>`,
  "utf8"
);

// run tests in jsdom
if (!watch) {
  JSDOM.fromFile("./test/results/unit.html", {
    pretendToBeVisual: true,
    runScripts: "dangerously",
    resources: "usable",
  }).then((dom) => {
    const passes = dom.window.document.querySelectorAll(".pass");
    const fails = dom.window.document.querySelectorAll(".fail");

    passes.forEach((pass) => {
      console.log(
        colors.FgGreen,
        pass.innerText,
        colors.FgWhite,
        pass.nextSibling.innerText,
        pass.nextSibling.nextSibling.innerText
      );
    });
    fails.forEach((fail) => {
      console.log(
        colors.FgRed,
        fail.innerText,
        colors.FgRed,
        fail.nextSibling.innerText,
        fail.nextSibling.nextSibling.innerText,
        fail.nextSibling.nextSibling.nextSibling.innerText
          ? "- " + fail.nextSibling.nextSibling.nextSibling.innerText
          : "",
        colors.FgWhite
      );
      failures += [
        fail.innerText,
        fail.nextSibling.innerText,
        fail.nextSibling.nextSibling.innerText,
        fail.nextSibling.nextSibling.nextSibling.innerText,
      ].join(" ");
    });
    console.log("");
    console.log(
      "Passes:",
      passes.length,
      "Fails:",
      fails.length,
      "Time:",
      parseFloat(dom.window.performance.now()).toFixed(3) + "ms"
    );
    console.log("");

    // log
    fs.writeFileSync(
      "./test/results/unit.txt",
      fails.length > 0 ? failures : "",
      "utf8"
    );
  });
}
