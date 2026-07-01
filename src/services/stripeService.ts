import Stripe from 'stripe';
import { config } from '../config/env';
import logger from '../utils/logger';
import { LicenciaRepository } from '../repositories/licenciaRepository';
import { getDatabase } from '../config/database';

const stripe = new Stripe(config.stripe.secretKey || '');

export interface StripePaymentIntent {
  clientSecret: string;
  paymentIntentId: string;
}

export interface StripeSubscription {
  id: string;
  customerId: string;
  status: string;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
}

class StripeService {
  /**
   * Create payment intent for license upgrade
   */
  async createPaymentIntent(
    empresaId: number,
    plan: 'BASICO' | 'PRO' | 'ENTERPRISE',
    amount: number,
    email: string,
  ): Promise<StripePaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        payment_method_types: ['card'],
        metadata: {
          empresaId: empresaId.toString(),
          plan,
        },
        receipt_email: email,
      });

      logger.info('Payment intent created:', {
        paymentIntentId: paymentIntent.id,
        amount,
        plan,
        empresaId,
      });

      return {
        clientSecret: (paymentIntent.client_secret as string) || '',
        paymentIntentId: paymentIntent.id,
      };
    } catch (error) {
      logger.error('Failed to create payment intent:', error);
      throw error;
    }
  }

  /**
   * Confirm payment and upgrade license
   */
  async confirmPaymentAndUpgradeLicense(
    paymentIntentId: string,
    empresaId: number,
    plan: 'BASICO' | 'PRO' | 'ENTERPRISE',
  ): Promise<boolean> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== 'succeeded') {
        logger.warn('Payment not succeeded:', { paymentIntentId, status: paymentIntent.status });
        return false;
      }

      // Update license in database
      const licencia = await LicenciaRepository.findByEmpresa(empresaId);
      if (!licencia) {
        throw new Error('License not found');
      }

      // Determine usuarios_max based on plan
      const usuariosMax: Record<string, number> = {
        BASICO: 5,
        PRO: 20,
        ENTERPRISE: 999,
      };

      await LicenciaRepository.update(licencia.id, {
        plan,
        usuarios_max: usuariosMax[plan],
        estado: 'activo',
        fecha_expiracion: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      });

      logger.info('License upgraded successfully:', { empresaId, plan });

      return true;
    } catch (error) {
      logger.error('Failed to confirm payment:', error);
      throw error;
    }
  }

  /**
   * Create subscription for recurring billing
   */
  async createSubscription(
    empresaId: number,
    customerId: string,
    plan: 'BASICO' | 'PRO' | 'ENTERPRISE',
  ): Promise<StripeSubscription> {
    try {
      // Plan IDs from Stripe dashboard
      const priceIds: Record<string, string> = {
        BASICO: 'price_basico_monthly',
        PRO: 'price_pro_monthly',
        ENTERPRISE: 'price_enterprise_monthly',
      };

      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [
          {
            price: priceIds[plan],
          },
        ],
        metadata: {
          empresaId: empresaId.toString(),
        },
      });

      logger.info('Subscription created:', {
        subscriptionId: subscription.id,
        customerId,
        plan,
      });

      return {
        id: subscription.id,
        customerId: (subscription.customer as string) || '',
        status: subscription.status,
        currentPeriodStart: new Date((subscription.current_period_start as number) * 1000),
        currentPeriodEnd: new Date((subscription.current_period_end as number) * 1000),
      };
    } catch (error) {
      logger.error('Failed to create subscription:', error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      await stripe.subscriptions.del(subscriptionId);

      logger.info('Subscription cancelled:', { subscriptionId });
    } catch (error) {
      logger.error('Failed to cancel subscription:', error);
      throw error;
    }
  }

  /**
   * Get customer by email
   */
  async getOrCreateCustomer(email: string, name: string): Promise<string> {
    try {
      // Search for existing customer
      const customers = await stripe.customers.list({
        email,
        limit: 1,
      });

      if (customers.data.length > 0) {
        return customers.data[0].id;
      }

      // Create new customer
      const customer = await stripe.customers.create({
        email,
        name,
      });

      logger.info('Customer created:', { customerId: customer.id, email });

      return customer.id;
    } catch (error) {
      logger.error('Failed to get or create customer:', error);
      throw error;
    }
  }

  /**
   * Process webhook event
   */
  async handleWebhookEvent(event: any): Promise<void> {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;

        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object);
          break;

        case 'invoice.payment_succeeded':
          await this.handleInvoiceSuccess(event.data.object);
          break;

        case 'invoice.payment_failed':
          await this.handleInvoiceFailure(event.data.object);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionCancelled(event.data.object);
          break;

        default:
          logger.debug('Unhandled webhook event:', event.type);
      }
    } catch (error) {
      logger.error('Failed to handle webhook:', error);
    }
  }

  /**
   * Handle payment success
   */
  private async handlePaymentSuccess(paymentIntent: any): Promise<void> {
    const empresaId = parseInt(paymentIntent.metadata.empresaId);
    const plan = paymentIntent.metadata.plan;

    logger.info('Payment succeeded:', { empresaId, plan });
    // TODO: Send confirmation email, update analytics
  }

  /**
   * Handle payment failure
   */
  private async handlePaymentFailure(paymentIntent: any): Promise<void> {
    const empresaId = parseInt(paymentIntent.metadata.empresaId);

    logger.error('Payment failed:', { empresaId, reason: paymentIntent.last_payment_error });
    // TODO: Send failure email, notify admin
  }

  /**
   * Handle invoice success
   */
  private async handleInvoiceSuccess(invoice: any): Promise<void> {
    logger.info('Invoice paid:', { invoiceId: invoice.id, amount: invoice.amount_paid });
  }

  /**
   * Handle invoice failure
   */
  private async handleInvoiceFailure(invoice: any): Promise<void> {
    logger.error('Invoice payment failed:', { invoiceId: invoice.id });
  }

  /**
   * Handle subscription cancelled
   */
  private async handleSubscriptionCancelled(subscription: any): Promise<void> {
    const empresaId = parseInt(subscription.metadata.empresaId);

    // Update license to inactive
    const licencia = await LicenciaRepository.findByEmpresa(empresaId);
    if (licencia) {
      await LicenciaRepository.update(licencia.id, {
        estado: 'inactivo',
      });
    }

    logger.info('Subscription cancelled, license deactivated:', { empresaId });
  }

  /**
   * Get invoice
   */
  async getInvoice(invoiceId: string): Promise<any> {
    return stripe.invoices.retrieve(invoiceId);
  }

  /**
   * List invoices for customer
   */
  async listInvoices(customerId: string, limit: number = 10): Promise<any[]> {
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit,
    });

    return invoices.data;
  }
}

export default new StripeService();
