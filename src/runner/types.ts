import type { TestCase } from "../content/types";

export type ConsoleLevel = "log" | "info" | "warn" | "error";

export interface ConsoleLine {
  level: ConsoleLevel;
  text: string;
}

export interface TestResult {
  name: string;
  status: "pass" | "fail" | "skipped";
  message?: string;
  actual?: string;
  expected?: string;
}

export interface RunError {
  kind: "syntax" | "runtime";
  message: string;
  stack?: string;
  line?: number;
}

export interface RunResult {
  status: "pass" | "fail" | "error" | "timeout";
  logs: ConsoleLine[];
  tests: TestResult[];
  error?: RunError;
  durationMs: number;
}

export interface RunRequest {
  code: string;
  tests: TestCase[];
  html?: string;
  timeoutMs?: number;
}

/** Messages posted from the sandbox iframe to the app. */
export type SandboxMessage =
  | { type: "ready" }
  | { type: "result"; id: number; result: RunResult }
  | { type: "log"; id: number; line: ConsoleLine };

/** Messages posted from the app to the sandbox iframe. */
export interface SandboxRunMessage {
  type: "run";
  id: number;
  request: RunRequest;
}
