import esbuild from "esbuild";
import fs from "fs";
import jsdom from "jsdom";
import colors from "./util/colors.js";
const { JSDOM } = jsdom;
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
  globalName: "DOMX",
  minify: true,
  outdir: "test",
  sourcemap: false,
  target: ["esnext"],
  treeShaking: true,
  watch: false,
  write: false,
}).outputFiles[0].text;

fs.writeFileSync(
  "./test/results/unit.html",
  `<html>
    <head>
      <title>DOMX Unit Tests</title>
      <script>${unitTestCode}</script>
    </head>
    <body>
      <div id="test-results" data-status="processing"></div>
      <div id="test-sandbox"></div>
    </body>
  </html>`,
  "utf8"
);

function waitForElement(document, selector, timeout = 3000) {
  return new Promise((resolve, reject) => {
    const interval = 100; // check every 100ms
    const endTime = Date.now() + timeout;

    const checkExistence = () => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
      } else if (Date.now() > endTime) {
        reject(new Error(`Test suite timed out: ${timeout}ms`));
      } else {
        setTimeout(checkExistence, interval);
      }
    };

    checkExistence();
  });
}

// run tests in jsdom
JSDOM.fromFile("./test/results/unit.html", {
  pretendToBeVisual: true,
  runScripts: "dangerously",
  resources: "usable",
}).then((dom) => {
  // wait for tests to finish by checking for data-status
  return waitForElement(dom.window.document, '#test-results[data-status="done"]').then(() => {
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
    fs.writeFileSync("./test/results/unit.txt", fails.length > 0 ? failures : "", "utf8");
  });
});
