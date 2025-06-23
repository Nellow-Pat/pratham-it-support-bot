import { Keyboard } from 'grammy';
import { injectable } from 'tsyringe';

export interface WebAppButtonProps {
  text: string;
  url: string;
}

@injectable()
export class WebAppButtonView {
  public build(props: WebAppButtonProps): Keyboard {
    const keyboard = new Keyboard().webApp(props.text, props.url);
    return keyboard;
  }
}