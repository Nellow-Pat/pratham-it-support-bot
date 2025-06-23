import { promises as fs } from 'fs';
import path from 'path';
import { injectable } from 'tsyringe';
import { z } from 'zod';

const callbackButtonSchema = z.object({
  text: z.string(),
  type: z.literal('callback'),
  value: z.string(),
});

const webappButtonSchema = z.object({
  text: z.string(),
  type: z.literal('webapp'),
  value: z.string(),
  path: z.string().startsWith('/', 'Path must start with a "/"'),
});

const buttonSchema = z.discriminatedUnion('type', [
  callbackButtonSchema,
  webappButtonSchema,
]);

const greetingSchema = z.object({
  title: z.string(),
  image_url: z.string().url().optional(),
  body: z.array(z.string()),
  buttons: z.array(buttonSchema),
});

export type InitialGreetingMessage = z.infer<typeof greetingSchema>;
export type GreetingButton = z.infer<typeof buttonSchema>;

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