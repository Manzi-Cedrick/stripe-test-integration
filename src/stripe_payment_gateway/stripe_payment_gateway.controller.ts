import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StripePaymentGatewayService } from './stripe_payment_gateway.service';
import { CreateStripeCustomerDto } from './dto/create-stripe_payment_gateway.dto';
import { UpdateStripeCustomerDto } from './dto/update-stripe_payment_gateway.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('stripe-payment-gateway')
export class StripePaymentGatewayController {
  constructor(private readonly stripePaymentGatewayService: StripePaymentGatewayService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCustomerDto: CreateStripeCustomerDto ) {
    return this.stripePaymentGatewayService.createCustomer(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.stripePaymentGatewayService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stripePaymentGatewayService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStripePaymentGatewayDto: UpdateStripeCustomerDto) {
    return this.stripePaymentGatewayService.update(+id, updateStripePaymentGatewayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stripePaymentGatewayService.remove(+id);
  }
}