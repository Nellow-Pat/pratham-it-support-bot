import { DependencyContainer } from "tsyringe";
import { ICommand } from "@/bot/base/interfaces/IHandler";
import { IWebAppParser } from "../interfaces/IWebAppParser";
import { OpenAppCommand } from "../commands/OpenAppCommand";
import { WebAppButtonView } from "../views/WebAppButtonView";
import { WebAppParserRegistry } from "../services/WebAppParserRegistry";
import { UserProfileParser } from "../parsers/UserProfileParser";
import { IssueReportParser } from "../parsers/IssueReportParser";

export function registerWebAppServices(container: DependencyContainer): void {
  container.registerSingleton(WebAppParserRegistry);
  container.register(ICommand, { useClass: OpenAppCommand });
  container.register(IWebAppParser, { useClass: UserProfileParser });
  container.register(IWebAppParser, { useClass: IssueReportParser });
  container.register(WebAppButtonView, { useClass: WebAppButtonView });
}
