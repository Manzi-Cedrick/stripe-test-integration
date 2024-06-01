import { Inject, Injectable } from '@nestjs/common';
import { CreateStripeCustomerDto } from './dto/create-stripe_payment_gateway.dto';
import Stripe from 'stripe';
import { UpdateStripeCustomerDto } from './dto/update-stripe_payment_gateway.dto';

@Injectable()
export class StripePaymentGatewayService {
  private stripe: Stripe;
  public constructor(
    @Inject('STRIPE_API_KEY') private readonly stripeSecretKey: string
  ) {
    this.stripe = new Stripe(this.stripeSecretKey, {
      apiVersion: '2024-04-10',
    });
  }
  createCustomer(createStripeCustomerDto: CreateStripeCustomerDto) {
    const data = this.stripe.customers.create(createStripeCustomerDto);
    console.log(data)
    return data;
  }

  findAll() {
    return `This action returns all stripePaymentGateway`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stripePaymentGateway`;
  }

  update(id: number, updateStripePaymentGatewayDto: UpdateStripeCustomerDto) {
    return `This action updates a #${id} stripePaymentGateway`;
  }

  remove(id: number) {
    return `This action removes a #${id} stripePaymentGateway`;
  }
}
