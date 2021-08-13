import { Select } from "../../deps.ts";

/**
 * Ask the user to pick one option from a list
 */
export async function askOption(question: string, options: string[]) {
  return await Select.prompt({ message: question, options });
}
