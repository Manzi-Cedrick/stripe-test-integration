import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateStripeChargeDto, CreateStripeCustomerDto } from './dto/create-stripe_payment_gateway.dto';
import Stripe from 'stripe';
import { UpdateStripeCustomerDto } from './dto/update-stripe_payment_gateway.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Charge, Customer, Prisma } from '@prisma/client'

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

  async createCharge(createStripeChargeDto: CreateStripeChargeDto)  {
    try {
      const data = await this.stripe.charges.create(createStripeChargeDto);
      console.log(data)
      // return {
      //   body: data,
      //   message: 'Charge created successfully',
      //   status: 201
      // };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeAPIError) {
        throw new Error(error.message);
      } else {
        throw new HttpException('An error occurred ' + error, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }


}
