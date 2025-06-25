import { Bot } from 'grammy';
import { DependencyContainer } from 'tsyringe';
import { Express } from 'express';
import { BotContext } from '../models/context.model';

export interface IFeatureModule {
  readonly name: string;
  register(container: DependencyContainer): void;
  initialize(botId: string, bot: Bot<BotContext>, container: DependencyContainer, app: Express): void;
}