import { InlineKeyboard  } from 'grammy';
import { injectable } from 'tsyringe';

export interface WebAppButtonProps {
  text: string;
  url: string;
}

@injectable()
export class WebAppButtonView {
  public build(props: WebAppButtonProps): InlineKeyboard {
    const keyboard = new InlineKeyboard().webApp(props.text, props.url);
    return keyboard;
  }
}