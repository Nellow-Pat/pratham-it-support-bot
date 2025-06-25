import { Bot } from 'grammy';
import { DependencyContainer } from 'tsyringe';
import { BotContext } from '../models/context.model';

export interface IFeatureModule {
  readonly name: string;
  register(container: DependencyContainer): void;
  initialize(bot: Bot<BotContext>, container: DependencyContainer): void;
}