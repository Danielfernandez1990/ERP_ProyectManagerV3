import Stripe from 'stripe';
import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import stripeService from '../services/stripeService';
import { UsuarioRepository } from '../repositories/usuarioRepository';
import { AppError, asyncHandler } from '../middleware/errorHandler';
import logger from '../utils/logger';
import { config } from '../config/env';

const router = Router();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stripe = new (Stripe as any)(config.stripe.secretKey || '') as Stripe;

router.post('/create-intent', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const { plan } = req.body;
  if (!['BASICO', 'PRO', 'ENTERPRISE'].includes(plan)) throw new AppError(400, 'INVALID_PLAN', 'Invalid plan');

  const usuario = await UsuarioRepository.findById(authReq.user.userId);
  if (!usuario) throw new AppError(404, 'USER_NOT_FOUND', 'User not found');

  const pricing: Record<string, number> = { BASICO: 29, PRO: 99, ENTERPRISE: 499 };
  const paymentIntent = await stripeService.createPaymentIntent(authReq.user.empresaId, plan, pricing[plan], usuario.email);

  res.json({ data: paymentIntent, amount: pricing[plan], plan });
}));

router.post('/confirm', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const { paymentIntentId, plan } = req.body;
  if (!paymentIntentId || !plan) throw new AppError(400, 'MISSING_FIELDS', 'paymentIntentId and plan required');

  const success = await stripeService.confirmPaymentAndUpgradeLicense(paymentIntentId, authReq.user.empresaId, plan);
  if (!success) throw new AppError(400, 'PAYMENT_FAILED', 'Payment confirmation failed');

  res.json({ message: 'License upgraded successfully', plan });
}));

router.get('/invoices', authMiddleware, asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as any;
  const usuario = await UsuarioRepository.findById(authReq.user.userId);
  if (!usuario) throw new AppError(404, 'USER_NOT_FOUND', 'User not found');

  const customerId = await stripeService.getOrCreateCustomer(usuario.email, usuario.nombre);
  const invoices = await stripeService.listInvoices(customerId);

  res.json({
    data: invoices.map((inv) => ({
      id: inv.id,
      amount: inv.amount_paid / 100,
      status: inv.status,
      date: new Date(inv.created * 1000),
      pdfUrl: (inv as any).invoice_pdf,
    })),
  });
}));

router.post('/webhook', async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  if (!sig || !config.stripe.webhookSecret) return res.status(400).send('Missing signature');

  try {
    const event = stripe.webhooks.constructEvent(req.body, sig as string, config.stripe.webhookSecret);
    await stripeService.handleWebhookEvent(event);
    res.json({ received: true });
  } catch (error) {
    logger.error('Webhook error:', error);
    res.status(400).send('Webhook error');
  }
});

export default router;
