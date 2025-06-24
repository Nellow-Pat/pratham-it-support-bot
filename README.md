# Support Bot


This is my take on building a modern  Telegram bot from scratch using Node.js, TypeScript, `grammy`, and an Express.js backend. The main idea was to create something more powerful than a simple command-response bot by integrating a real AI chat, interactive menus, and a full-blown **Telegram Web App** for complex tasks.

I've put a lot of effort into the architecture, using Dependency Injection (`tsyringe`) and a repository/service-like pattern to keep things clean, modular, and easy to extend. It's a learning project, so some parts might not be perfect, but the foundation is solid. If you see something that could be better or have an idea, feel free to give feedback!

---

### Features

*   **Conversational AI** - Connects to a backend AI service for chat support. The bot can maintain a conversation session with a user. (seperate API)
*   **Interactive Menus** - Clean and navigable menus built with Inline Keyboards. Users can browse FAQs without spamming the chat.
*   **Telegram Web App Integration** - The bot can launch a custom web interface right inside Telegram. This is used for complex interactions like:
    *   Submitting detailed forms.
    *   Connecting with your services
*   **Direct Webhook Support** - The Web App communicates with a dedicated server
*   **Easy to update Architecture** - Commands, event handlers, and services are all split up, so adding new features doesn't mean rewriting everything.
*   **Dependency Injection** - Uses `tsyringe` to manage dependencies, keeping components loosely coupled and easy to test or replace.
*   **Type-Safe** - Fully written in TypeScript because type safety is a beautiful thing.
*   **Configuration Validation** - Uses `zod` to validate environment variables on startup, preventing the bot from running with a broken config.
*   **Logging** - Uses a custom logger to log events to both the console and separate log files (`info.log`, `error.log`, etc.).

---

### Project Goals

I made this bot for an upcomming presentation in `Pratham It system` to demonstrate how bots can be used to increase efficeincy and client satisfaction

*   **Modular Code** - Commands, handlers, views, and services are separated by concern. The goal is to make it easy to find what you're looking for and to add new things.
*   **Scalability-Ready** - The architecture (DI, Registries) is designed to scale. If we wanted to switch from an in-memory session store to Redis, we'd only need to change one service, not the entire application.
*   **Amazing User Experience** - To provide the best support, the bot combines three modes of interaction: simple commands, guided menu navigation, and a web interface.
*   **Learning & Fun** - The main goal was to dive deep into building a serious, real-world bot and learn the best practices for it.

---

### Setup

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone https://github.com/Nellow-Pat/pratham-it-support-bot
    cd nellow-pat-pratham-it-support-bot
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Set up your environment variables**:
    Copy `.env.example` to a new file named `.env` and fill it out with your details.
    ```bash
    cp .env.example .env
    ```
    *   `TELEGRAM_BOT_TOKEN` - Your bot token from BotFather.
    *   `AI_API_BASE_URL` - The base URL of your backend AI service.
    *   `AI_API_USERNAME` - The username for authenticating with the AI service.
    *   `AI_API_PASSWORD` - The password for the AI service.
    *   `WEB_APP_URL` - The public URL where your frontend Web App is hosted, must be `HTTPS`
    *   `WEB_SERVER_PORT` - The local port for the bot's Express.js webhook server 

4.  **Build the project**:
    This compiles the TypeScript code to JavaScript in the `dist` directory.
    ```bash
    npm run build
    ```

5.  **Start the bot**:
    This runs the compiled code.
    ```bash
    npm run start
    ```

6.  **(For Development)** To run with hot-reloading whenever you make changes to the code:
    ```bash
    npm run dev
    ```

---

### Sample Usage

*   **/start** - The main entry point. The bot will reply with a beautiful welcome menu that includes an image and several buttons.
*   **Chat with AI** - (Button) Starts a one-on-one conversational session with the AI backend.
*   **Raise an issue** - (Button) Opens the Telegram Web App to a form where the user can submit a detailed issue report.
*   **View FAQs** - (Button) Opens a new menu where the user can browse frequently asked questions without needing to talk to the AI.
*   **/end** - Ends an active AI chat session.

---

### How to Add New Features

Thanks to the architecture, adding new things is pretty ezz.

#### How to Add a New Command (e.g., `/help`)

1.  Create a new file in `src/bot/chat/commands/HelpCommand.ts`.
2.  Implement the `ICommand` interface and use the `@injectable()`.

    ```typescript
    // src/bot/chat/commands/HelpCommand.ts
    import { injectable } from 'tsyringe';
    import { CommandContext } from 'grammy';
    import { BotContext } from '@/bot/models/context.model';
    import { ICommand } from '@/bot/base/interfaces/IHandler';

    @injectable()
    export class HelpCommand implements ICommand {
      public readonly command = 'help'; // The command name

      public async handle(ctx: CommandContext<BotContext>): Promise<void> {
        await ctx.reply('This is the help message!');
      }
    }
    ```

3.  Register it in the DI container at `src/bot/chat/container/index.ts`:

    ```typescript
    // ...
    import { HelpCommand } from '../commands/HelpCommand';
    // ...
    container.register(ICommand, { useClass: HelpCommand });
    // ...
    ```

    That's it! The `HandlerRegistry` will automatically discover and register it when the bot starts.

#### How to Add a New Menu View

1.  Create a new JSON file in `src/bot/chat/assets/views/`, for example `help_menu.json`.
2.  Follow the existing schema (`title`, `body`, `buttons`).
3.  To link to it, simply add a button in another menu's JSON file with a `value` like `"view:help_menu"`. The `NavigationViewCallbackHandler` will automatically handle rendering it.

#### How to Add a New Web App Form/Parser

1.  First, build the new form in your frontend
2.  When the form is submitted, make sure your frontend sends a unique `type` in the payload to your bot's webhook. For example: `{"type": "user_feedback", "data": {...}}`.
3.  Create a new parser file in `src/bot/web-app/parsers/FeedbackParser.ts`.
4.  Implement the `IWebAppParser` interface. The `dataType` must match the `type` from your frontend.

    ```typescript
    // src/bot/web-app/parsers/FeedbackParser.ts
    import { injectable } from 'tsyringe';
    import { IWebAppParser } from '../interfaces/IWebAppParser';
    import { ParserContext } from '../models/parser-context.model';

    @injectable()
    export class FeedbackParser implements IWebAppParser<{ rating: number; comment: string }> {
      public readonly dataType = 'user_feedback'; // Must match frontend type

      public async parseAndHandle(ctx: ParserContext, data: { rating: number; comment:string }): Promise<void> {
        // Your logic here...
        await ctx.reply(`Thanks for your feedback! You rated us ${data.rating}/5.`);
      }
    }
    ```

5.  Register your new parser in `src/bot/web-app/container/index.ts`:

    ```typescript
    // ...
    import { FeedbackParser } from '../parsers/FeedbackParser';
    // ...
    container.register(IWebAppParser, { useClass: FeedbackParser });
    // ...
    ```

    The `WebhookController` will now automatically route data with `type: "user_feedback"` to your new parser.

---

Thanks for checking out the project!
