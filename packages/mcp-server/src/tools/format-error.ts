// Tool failures go back to the client as text, never as a thrown error.
export function formatToolError(error: unknown): string {
  return `Error: ${error instanceof Error ? error.message : String(error)}`;
}
