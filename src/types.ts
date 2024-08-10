export type TestResult = {
  label: string;
  pass: boolean;
  message?: string;
};

export type Test = {
  done: (callback: (result: TestResult) => void) => void;
};
