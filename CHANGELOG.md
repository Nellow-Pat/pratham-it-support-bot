# Changelog

All notable changes to this project will be documented in this file.

## [v2.0.0] - The Multi-Bot Refactor - 2025-06-25

This release marks a complete architectural overhaul of the bot, moving from a single-instance application to a powerful, feature-driven, multi-bot orchestrator. The goal was to make the system massively scalable, configurable, and even easier to extend without touching core files.

###  Added
- **Multi-Bot Orchestrator:** The application can now run multiple, independent bot instances.
- **Configuration-Driven Bots:** Bot instances and their enabled features are now defined in `config/bots.config.json`.
- **Feature Module System:** The entire architecture is now centered around self-contained "Feature Modules" located in `src/features/`. Adding new functionality is as simple as creating a new feature folder.
- **Docker & Docker Compose Support:** Full containerization setup with a multi-stage `Dockerfile` and a `docker-compose.yml` for easy, consistent, and reproducible deployments.
- **Scoped Dependency Injection:** Each bot instance gets its own child DI container, ensuring features and services are properly sandboxed and don't interfere with each other.

### Changed
- **Project Structure:** Major reorganization into `core`, `shared`, and `features` directories to better reflect the separation of concerns.
- **Handler Registration:** The old central `HandlerRegistry` is gone. Each feature module is now responsible for registering and initializing its own commands and event handlers.
- **Session Management:** Replaced the custom in-memory `ChatSessionService` with grammy's built-in `session` middleware for better scalability and type safety (`ctx.session`).
- **Production Build:** The build and start process has been made robust for production, correctly handling path aliases and environment variables.

### Fixed
- Resolved a circular dependency loop between `ApiService` and `AuthService` that occurred during startup.
- Fixed all TypeScript path alias (`@/`) issues that prevented the production build from running correctly.

### TODO
- Fully implement the `prathamNotifierBot` example.
- Add a dedicated "notifier" feature that can send messages to specific chat IDs.
- Create a unique `/start` command implementation for the notifier bot to demonstrate its custom menu capabilities.
