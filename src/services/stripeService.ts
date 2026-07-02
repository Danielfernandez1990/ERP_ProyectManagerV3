import Stripe from 'stripe';
import { config } from '../config/env';
import logger from '../utils/logger';
import { LicenciaRepository } from '../repositories/licenciaRepository';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stripe = new (Stripe as any)(config.stripe.secretKey || '') as Stripe;

export interface StripePaymentIntent { clientSecret: string; paymentIntentId: string; }
export interface StripeSubscription { id: string; customerId: string; status: string; currentPeriodStart: Date; currentPeriodEnd: Date; }

class StripeService {
  async createPaymentIntent(empresaId: number, plan: string, amount: number, email: string): Promise<StripePaymentIntent> {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: { empresaId: empresaId.toString(), plan },
      receipt_email: email,
    });
    logger.info('Payment intent created:', { paymentIntentId: paymentIntent.id });
    return { clientSecret: paymentIntent.client_secret || '', paymentIntentId: paymentIntent.id };
  }

  async confirmPaymentAndUpgradeLicense(paymentIntentId: string, empresaId: number, plan: string): Promise<boolean> {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') return false;

    const licencia = await LicenciaRepository.findByEmpresa(empresaId);
    if (!licencia) throw new Error('License not found');

    const usuariosMax: Record<string, number> = { BASICO: 5, PRO: 20, ENTERPRISE: 999 };
    await LicenciaRepository.update(licencia.id, {
      plan: plan as any,
      usuarios_max: usuariosMax[plan] || 5,
      estado: 'activo',
      fecha_expiracion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    });
    return true;
  }

  async createSubscription(empresaId: number, customerId: string, plan: string): Promise<StripeSubscription> {
    const priceIds: Record<string, string> = {
      BASICO: 'price_basico_monthly',
      PRO: 'price_pro_monthly',
      ENTERPRISE: 'price_enterprise_monthly',
    };
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceIds[plan] }],
      metadata: { empresaId: empresaId.toString() },
    });
    return {
      id: subscription.id,
      customerId: subscription.customer as string,
      status: subscription.status,
      currentPeriodStart: new Date((subscription as any).current_period_start * 1000),
      currentPeriodEnd: new Date((subscription as any).current_period_end * 1000),
    };
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    await (stripe.subscriptions as any).cancel(subscriptionId);
  }

  async getOrCreateCustomer(email: string, name: string): Promise<string> {
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length > 0) return customers.data[0].id;
    const customer = await stripe.customers.create({ email, name });
    return customer.id;
  }

  async handleWebhookEvent(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case 'payment_intent.succeeded':
        logger.info('Payment succeeded:', { id: (event.data.object as any).id });
        break;
      case 'customer.subscription.deleted': {
        const sub = event.data.object as any;
        const empresaId = parseInt(sub.metadata?.empresaId);
        if (empresaId) {
          const licencia = await LicenciaRepository.findByEmpresa(empresaId);
          if (licencia) await LicenciaRepository.update(licencia.id, { estado: 'inactivo' });
        }
        break;
      }
      default:
        logger.debug('Unhandled webhook event:', event.type);
    }
  }

  async listInvoices(customerId: string, limit = 10): Promise<Stripe.Invoice[]> {
    const invoices = await stripe.invoices.list({ customer: customerId, limit });
    return invoices.data;
  }

  async getInvoice(invoiceId: string): Promise<Stripe.Invoice> {
    return stripe.invoices.retrieve(invoiceId);
  }
}

export default new StripeService();
