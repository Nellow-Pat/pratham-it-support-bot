import { InlineKeyboard } from 'grammy';
import { injectable } from 'tsyringe';

export interface WelcomeViewProps {
  buttonText: string;
}

@injectable()
export class WelcomeView {
  public build(props: WelcomeViewProps): InlineKeyboard {
    const keyboard = new InlineKeyboard();
    keyboard.text(props.buttonText, 'explore_options_callback');
    return keyboard;
  }
}