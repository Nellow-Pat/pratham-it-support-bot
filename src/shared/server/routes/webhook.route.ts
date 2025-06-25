/// <reference path="../../../types/express/index.d.ts" />

import { Router, Request, Response, NextFunction } from 'express';
import { container as mainContainer, DependencyContainer } from 'tsyringe';
import { WebhookController } from '../implementations/WebhookController';

const webhookRouter = Router();
const controller = mainContainer.resolve(WebhookController);

const containerMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const botId = req.params.botId;
        if (!botId) {
            res.status(400).json({ success: false, message: 'Bot ID missing in URL' });
            return;
        }

        req.container = mainContainer.resolve<DependencyContainer>(botId);
        next();
    } catch (e) {
        res.status(404).json({ success: false, message: `No active bot instance found for ID: ${req.params.botId}` });
        return;
    }
};

webhookRouter.post('/:botId', containerMiddleware, (req, res) => controller.handle(req, res));

export { webhookRouter };