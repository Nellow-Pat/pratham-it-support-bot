import { injectable, inject } from 'tsyringe';
import { CommandContext } from 'grammy';
import { BotContext } from '@/core/models/context.model';
import { ICommand } from '@/core/interfaces/IHandler';
import { IChatService } from '../interfaces/IChatService';

@injectable()
export class EndCommand implements ICommand {
  public readonly command = 'end';

  constructor(
    @inject(IChatService) private readonly chatService: IChatService,
  ) {}

  public async handle(ctx: CommandContext<BotContext>): Promise<void> {
    await this.chatService.endChat(ctx);
  }
}