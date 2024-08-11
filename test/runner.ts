import { Test, TestResult } from "../src/types";

async function* testRunner(tests: Test[]): AsyncGenerator<TestResult, void, unknown> {
  for (const test of tests) {
    yield new Promise<TestResult>((resolve) => {
      test((result: TestResult) => {
        resolve(result);
      });
    });
  }
}

async function runTests(tests: Test[]): Promise<TestResult[]> {
  const results: TestResult[] = [];

  for await (const result of testRunner(tests)) {
    results.push(result);
  }

  return results;
}

export async function runner(tests: Test[]) {
  return await runTests(tests).then((results) => {
    // console.log("All results:", results);

    const sandbox = document.querySelector("#test-sandbox") as HTMLElement;
    const resultOutput = document.querySelector("#test-results") as HTMLElement;
    resultOutput.style.display = "grid";
    resultOutput.style.columnGap = "10px";
    resultOutput.style.rowGap = "2px";
    resultOutput.style.gridTemplateColumns = "auto auto 1fr";

    results.forEach((result) => {
      const statusEl = document.createElement("div");
      statusEl.style.fontFamily = "monospace";
      statusEl.style.fontSize = "14px";
      statusEl.style.color = result.pass ? "green" : "red";
      statusEl.innerText = result.pass ? "✔" : "✘";
      statusEl.className = result.pass ? "pass" : "fail";
      const labelEl = document.createElement("div");
      labelEl.innerText = result.label + ": ";
      labelEl.style.color = result.pass ? "green" : "red";
      const messageEl = document.createElement("div");
      messageEl.innerText = result.message || "";
      messageEl.style.color = result.pass ? "green" : "red";
      resultOutput.append(statusEl, labelEl, messageEl);
      sandbox.innerHTML = "";
    });

    resultOutput.dataset.status = "done";
  });
}
