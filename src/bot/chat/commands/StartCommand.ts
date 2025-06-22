import { injectable, inject } from 'tsyringe';
import { CommandContext } from 'grammy';
import { BotContext } from '@/bot/models/context.model';
import { IChatService } from '../interfaces/IChatService';
import { ICommand } from '@/bot/base/interfaces/IHandler';

@injectable()
export class StartCommand implements ICommand {
  public readonly command = 'start';

  constructor(@inject(IChatService) private readonly chatService: IChatService) {}

  public async handle(ctx: CommandContext<BotContext>): Promise<void> {
    await this.chatService.sendWelcomeMessage(ctx);
  }
}