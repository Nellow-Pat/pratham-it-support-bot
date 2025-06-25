import { InlineKeyboard } from 'grammy';
import { injectable, inject } from 'tsyringe';
import { Config } from '@/config';
import { ViewButton } from '../factories/NavigationalViewFactory';

export interface MenuViewProps {
  buttons: ViewButton[]; 
}

@injectable()
export class MenuView {
  constructor(@inject(Config) private readonly config: Config) {}

  public build(props: MenuViewProps): InlineKeyboard {
    const keyboard = new InlineKeyboard();

    props.buttons.forEach((button, index) => {
      switch (button.type) {
        case 'callback':
          keyboard.text(button.text, button.value);
          break;
        case 'webapp':
          const fullUrl = new URL(button.path, this.config.webAppUrl).toString();
          keyboard.webApp(button.text, fullUrl);
          break;
      }

      if (index % 2 === 1 && index < props.buttons.length - 1) {
        keyboard.row();
      }
    });

    return keyboard;
  }
}