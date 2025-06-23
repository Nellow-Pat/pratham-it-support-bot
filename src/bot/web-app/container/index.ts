import { DependencyContainer } from "tsyringe";
import { ICommand } from "@/bot/base/interfaces/IHandler";
import { IWebAppParser } from "../interfaces/IWebAppParser";
import { OpenAppCommand } from "../commands/OpenAppCommand";
import { WebAppButtonView } from "../views/WebAppButtonView";
import { WebAppParserRegistry } from "../services/WebAppParserRegistry";
import { UserProfileParser } from "../parsers/UserProfileParser";

export function registerWebAppServices(container: DependencyContainer): void {
  container.registerSingleton(WebAppParserRegistry);
  container.register(ICommand, { useClass: OpenAppCommand });
  container.register(IWebAppParser, { useClass: UserProfileParser });
  container.register(WebAppButtonView, { useClass: WebAppButtonView });
}
