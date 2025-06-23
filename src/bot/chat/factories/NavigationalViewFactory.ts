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
  path: z.string().startsWith('/'),
});

const buttonSchema = z.discriminatedUnion('type', [
  callbackButtonSchema,
  webappButtonSchema,
]);


const viewSchema = z.object({
  title: z.string(),
  image_url: z.string().url().optional(),
  body: z.array(z.string()), 
  buttons: z.array(buttonSchema),
});

export type NavigationalViewData = z.infer<typeof viewSchema>;
export type ViewButton = z.infer<typeof buttonSchema>;


@injectable()
export class NavigationalViewFactory {
  private readonly viewsDir = path.join(__dirname, '../assets/views');

  /**
   * Dynamically loads and validates a view's data from a JSON file.
   * @param viewName The name of the JSON file (without the .json extension).
   * @returns A promise that resolves with the parsed and validated view data.
   */
  public async loadView(viewName: string): Promise<NavigationalViewData> {
    const filePath = path.join(this.viewsDir, `${viewName}.json`);
    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const json = JSON.parse(fileContent);
      return viewSchema.parse(json);
    } catch (error) {
      console.error(`Error loading or parsing view: ${viewName}.json`);
      throw error; 
    }
  }
}