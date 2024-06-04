import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateStripeChargeDto, CreateStripeCustomerDto, CreateStripeCardTokenPaymentMethodDto } from './dto/create-stripe_payment_gateway.dto';
import Stripe from 'stripe';
import { UpdateStripeCustomerDto } from './dto/update-stripe_payment_gateway.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Charge, Customer, Prisma, TokenCard } from '@prisma/client'

@Injectable()
export class StripePaymentGatewayService {
  private stripe: Stripe;
  public constructor(
    @Inject('STRIPE_API_KEY') private readonly stripeSecretKey: string, private readonly prisma: PrismaService
  ) {
    this.stripe = new Stripe(this.stripeSecretKey, {
      apiVersion: '2024-04-10',
    });
  }
  async createCustomer(createStripeCustomerDto: CreateStripeCustomerDto): Promise<ServiceAPIResponse<Customer>> {
    try {
      const data = await this.stripe.customers.create(createStripeCustomerDto);
      const { id, email, name, description, phone, address, balance, currency } = data;
      const { line1, city, state, postal_code, country } = address;
      const newCustomer = await this.prisma.customer.create({
        data: {
          stripeId: id,
          email,
          name,
          description,
          phone,
          address: {
            create: {
              line1,
              city,
              state,
              postal_code,
              country
            }
          },
          balance,
          currency
        }
      }); return {
        body: newCustomer,
        message: 'Customer created successfully',
        status: 201
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeAPIError) {
        throw new Error(error.message);
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
            throw new HttpException('Customer already exists', HttpStatus.CONFLICT);
          default:
            throw new HttpException('An error occurred ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      } else {
        throw new HttpException('An unexpected error ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async findAllCustomers(): Promise<ServiceAPIResponse<Customer[]>> {
    try {
      const customers = await this.prisma.customer.findMany();
      return {
        body: customers,
        message: 'Customers retrieved successfully',
        status: 200
      };
    } catch (error) {
      throw new HttpException('An error occurred ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneCustomer(id: string): Promise<ServiceAPIResponse<Customer>> {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: {
          stripeId: id
        }
      });
      if (!customer) {
        throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
      }
      return {
        body: customer,
        message: 'Customer retrieved successfully',
        status: 200
      };
    } catch (error) {
      throw new HttpException('An error occurred ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateCustomer(id: string, updateStripePaymentGatewayDto: UpdateStripeCustomerDto) {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: {
          stripeId: id
        }
      });

      if (!customer) {
        throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
      }
      const data = await this.stripe.customers.update(id, updateStripePaymentGatewayDto);
      const { email, name, description, phone, address, balance, currency } = data;
      const { line1, city, state, postal_code, country } = address;
      const updatedCustomer = await this.prisma.customer.update({
        where: {
          stripeId: id
        },
        data: {
          email,
          name,
          description,
          phone,
          address: {
            update: {
              where: {
                id: customer.addressId
              },
              data: {
                line1,
                city,
                state,
                postal_code,
                country
              }
            }
          },
          balance,
          currency
        }
      });
      return {
        body: updatedCustomer,
        message: 'Customer updated successfully',
        status: 200
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeAPIError) {
        throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
      } else {
        throw new HttpException('An error occurred ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async removeCustomer(id: string) {
    try {
      await this.stripe.customers.del(id);
      await this.prisma.customer.delete({
        where: {
          stripeId: id
        }
      });
      return {
        message: 'Customer deleted successfully',
        status: 200
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeAPIError) {
        throw new Error(error.message);
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2025':
            throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
          default:
            throw new HttpException('An error occurred ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      } else {
        throw new HttpException('An unexpected error ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async createCharge(createStripeChargeDto: CreateStripeChargeDto) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create(createStripeChargeDto);
      const paymentMethod = await this.stripe.paymentMethods.create(
        {
          type: 'card',
          card: {
            number: '4242424242424242',
            exp_month: 12,
            exp_year: 2022,
            cvc: '123'
          }
        }
      );

      const confirmCharge = await this.stripe.paymentIntents.confirm(paymentIntent.id, {
        payment_method: paymentMethod.id
      });

      const { id, amount, currency, customer, description, receipt_email } = confirmCharge;
      const charge = await this.prisma.charge.create({
        data: {
          id,
          amount,
          currency,
          stripe_customer_id: customer.toString(),
          description,
          receipt_email,         
        }
      });

      return {
        body: charge,
        message: 'Charge created successfully',
        status: 201
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeAPIError) {
        throw new Error(error.message);
      } else {
        throw new HttpException('An error occurred ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async findAllCharges(): Promise<ServiceAPIResponse<Charge[]>> {
    try {
      const charges = await this.prisma.charge.findMany();
      return {
        body: charges,
        message: 'Charges retrieved successfully',
        status: 200
      };
    } catch (error) {
      throw new HttpException('An error occurred ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOneCharge(id: string): Promise<ServiceAPIResponse<Charge>> {
    try {
      const charge = await this.prisma.charge.findUnique({
        where: {
          id: id
        }
      });
      if (!charge) {
        throw new HttpException('Charge not found', HttpStatus.NOT_FOUND);
      }
      return {
        body: charge,
        message: 'Charge retrieved successfully',
        status: 200
      };
    } catch (error) {
      throw new HttpException('An error occurred ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removeCharge(id: string) {
    try {
      await this.stripe.charges.del(id);
      await this.prisma.charge.delete({
        where: {
          id: id
        }
      });
      return {
        message: 'Charge deleted successfully',
        status: 200
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeAPIError) {
        throw new Error(error.message);
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2025':
            throw new HttpException('Charge not found', HttpStatus.NOT_FOUND);
          default:
            throw new HttpException('An error occurred ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      } else {
        throw new HttpException('An unexpected error ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async refundCharge(chargeId: string) {
    try {
      const refund = await this.stripe.refunds.create({
        charge: chargeId
      });
      return {
        body: refund,
        message: 'Charge refunded successfully',
        status: 200
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeAPIError) {
        throw new Error(error.message);
      } else {
        throw new HttpException('An error occurred ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async createCardTokenPaymentMethod(createPaymentMethodDto: CreateStripeCardTokenPaymentMethodDto) {
    try {
      const paymentMethod = await this.stripe.paymentMethods.create({
        type: createPaymentMethodDto.type,
        card: {
          number: createPaymentMethodDto.card.number,
          exp_month: createPaymentMethodDto.card.exp_month,
          exp_year: createPaymentMethodDto.card.exp_year,
          cvc: createPaymentMethodDto.card.cvc,
        }
      });
      const { type, customer } = paymentMethod;
      const { exp_month, exp_year, brand, fingerprint, funding } = paymentMethod.card
      const { cvc_check } = paymentMethod.card.checks

      const newPaymentMethod = await this.prisma.tokenCard.create({
        data: {
          number: paymentMethod.card.last4,
          exp_month,
          exp_year,
          cvc: createPaymentMethodDto.card.cvc,
          brand,
          fingerprint,
          funding,
          cvc_check,
          type,
          customer_id: customer.toString()
        }
      });
      return {
        body: newPaymentMethod,
        message: 'Payment method created successfully',
        status: 201
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeAPIError) {
        throw new Error(error.message);
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2002':
            throw new HttpException('Payment method already exists', HttpStatus.CONFLICT);
          default:
            throw new HttpException('An error occurred ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      } else {
        throw new HttpException('An unexpected error ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async findAllPaymentMethods(): Promise<ServiceAPIResponse<TokenCard[]>> {
    try {
      const paymentMethods = await this.prisma.tokenCard.findMany();
      return {
        body: paymentMethods,
        message: 'Payment methods retrieved successfully',
        status: 200
      };
    } catch (error) {
      throw new HttpException('An error occurred ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findOnePaymentMethod(id: string): Promise<ServiceAPIResponse<TokenCard>> {
    try {
      const paymentMethod = await this.prisma.tokenCard.findUnique({
        where: {
          id: id
        }
      });
      if (!paymentMethod) {
        throw new HttpException('Payment method not found', HttpStatus.NOT_FOUND);
      }
      return {
        body: paymentMethod,
        message: 'Payment method retrieved successfully',
        status: 200
      };
    } catch (error) {
      throw new HttpException('An error occurred ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async removePaymentMethod(id: string) {
    try {
      await this.stripe.paymentMethods.detach(id);
      await this.prisma.tokenCard.delete({
        where: {
          id: id
        }
      });
      return {
        message: 'Payment method deleted successfully',
        status: 200
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeAPIError) {
        throw new Error(error.message);
      } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
        switch (error.code) {
          case 'P2025':
            throw new HttpException('Payment method not found', HttpStatus.NOT_FOUND);
          default:
            throw new HttpException('An error occurred ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
      } else {
        throw new HttpException('An unexpected error ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  async attachPaymentMethodToCustomer(paymentMethodId: string, customerId: string) {
    try {
      const paymentMethod = await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      });
      return {
        body: paymentMethod,
        message: 'Payment method attached to customer successfully',
        status: 200
      };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeAPIError) {
        throw new Error(error.message);
      } else {
        throw new HttpException('An error occurred ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
} 
