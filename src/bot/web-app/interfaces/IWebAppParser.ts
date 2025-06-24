import { ParserContext } from '../models/parser-context.model';

export const IWebAppParser = 'IWebAppParser';

export interface IWebAppParser<T> {
  /**
   * A string identifier for the data type this parser handles.
   * This must match the 'type' field in the WebAppResponse.
   */
  readonly dataType: string;

  /**
   * Parses the incoming data with a schema (like Zod) and handles the business logic.
   * @param ctx The context of the message, either real or synthetic.
   * @param data The specific data payload from the WebAppResponse.
   */
  parseAndHandle(ctx: ParserContext, data: T): Promise<void>;
}