export type TestResult = {
  label: string;
  pass: boolean;
  message?: string;
};

export type Test = (callback: (result: TestResult) => void) => void;
