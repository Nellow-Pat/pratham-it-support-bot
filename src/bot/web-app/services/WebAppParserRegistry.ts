import { injectable, inject, injectAll, singleton } from 'tsyringe';
import { LoggerService } from '@/utils/logger';
import { IWebAppParser } from '../interfaces/IWebAppParser';

@singleton()
@injectable()
export class WebAppParserRegistry {
  public readonly parsers: Map<string, IWebAppParser<unknown>>;

  constructor(
    @inject(LoggerService) private readonly logger: LoggerService,
    @injectAll(IWebAppParser) allParsers: IWebAppParser<unknown>[],
  ) {
    this.parsers = new Map(allParsers.map((p) => [p.dataType, p]));
    this.logger.info(`WebAppParserRegistry initialized with ${this.parsers.size} parsers.`);
  }
}