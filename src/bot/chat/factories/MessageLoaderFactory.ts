import { promises as fs } from 'fs';
import path from 'path';
import { injectable } from 'tsyringe';
import { z } from 'zod';

const greetingSchema = z.object({
  title: z.string(),
  body: z.string(),
  button_text: z.string(),
});

export type InitialGreetingMessage = z.infer<typeof greetingSchema>;

@injectable()
export class MessageLoaderFactory {
  private readonly greetingPath = path.join(
    __dirname,
    '../assets/initial_greeting.json',
  );

  public async loadInitialGreeting(): Promise<InitialGreetingMessage> {
    const fileContent = await fs.readFile(this.greetingPath, 'utf-8');
    const json = JSON.parse(fileContent);
    return greetingSchema.parse(json);
  }
}