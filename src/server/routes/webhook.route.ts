import { Router, Request, Response } from 'express';
import { container } from 'tsyringe';
import { WebhookController } from '../controllers/WebhookController';

const webhookRouter = Router();

// const controller = container.resolve(WebhookController);

webhookRouter.post('/', (req: Request, res: Response) => {
  const controller = container.resolve(WebhookController);
  controller.handle(req, res);
});

export { webhookRouter };