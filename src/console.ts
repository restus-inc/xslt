/* eslint-disable no-console */
import { createInterface } from 'readline'

/**
 * Read a single line of input from stdin and return it as a string.
 * The returned string does not include the newline character.
 */
export async function readStdin(): Promise<string> {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  })

  return new Promise((resolve) => {
    rl.on('line', (line) => {
      rl.close()
      resolve(line)
    })
  })
}

/**
 * Write a line of text to stdout, followed by a newline character.
 * @param line String to display
 */
export function writeLine(line: string): void {
  console.log(line)
}

/**
 * Write text to stdout without a newline character.
 * @param text String to display
 */
export function writeWithoutNewline(text: string): void {
  process.stdout.write(text)
}

/**
 * Write a line of text to stderr, followed by a newline character.
 * @param line String to display
 */
export function writeErrorLine(line: string): void {
  console.error(line)
}
