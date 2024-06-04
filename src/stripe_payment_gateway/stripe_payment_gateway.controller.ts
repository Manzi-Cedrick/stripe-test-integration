import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { StripePaymentGatewayService } from './stripe_payment_gateway.service';
import { CreateStripeCardTokenPaymentMethodDto, CreateStripeChargeDto, CreateStripeCustomerDto } from './dto/create-stripe_payment_gateway.dto';
import { UpdateStripeCustomerDto } from './dto/update-stripe_payment_gateway.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Controller('stripe-payment-gateway')
export class StripePaymentGatewayController {
  constructor(private readonly stripePaymentGatewayService: StripePaymentGatewayService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCustomerDto: CreateStripeCustomerDto ) {
    return this.stripePaymentGatewayService.createCustomer(createCustomerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.SUPERUSER)
  @Get()
  findAll() {
    return this.stripePaymentGatewayService.findAllCustomers();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.SUPERUSER)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.stripePaymentGatewayService.findOneCustomer(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.SUPERUSER)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStripePaymentGatewayDto: UpdateStripeCustomerDto) {
    return this.stripePaymentGatewayService.updateCustomer(id, updateStripePaymentGatewayDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.SUPERUSER)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.stripePaymentGatewayService.removeCustomer(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('charge')
  createCharge(@Body() createChargeDto: CreateStripeChargeDto) {
    return this.stripePaymentGatewayService.createCharge(createChargeDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.SUPERUSER)
  @Get('charge')
  findAllCharges() {
    return this.stripePaymentGatewayService.findAllCharges();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.SUPERUSER)
  @Get('charge/:id')
  findOneCharge(@Param('id') id: string) {
    return this.stripePaymentGatewayService.findOneCharge(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.SUPERUSER)
  @Delete('charge/:id')
  removeCharge(@Param('id') id: string) {
    return this.stripePaymentGatewayService.removeCharge(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('charge/refund/:id')
  refundCharge(@Param('id') id: string) {
    return this.stripePaymentGatewayService.refundCharge(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('payment-method')
  createPaymentMethod(@Body() createPaymentMethodDto: CreateStripeCardTokenPaymentMethodDto) {
    return this.stripePaymentGatewayService.createCardTokenPaymentMethod(createPaymentMethodDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.SUPERUSER)
  @Get('payment-method')
  findAllPaymentMethods() {
    return this.stripePaymentGatewayService.findAllPaymentMethods();
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.SUPERUSER)
  @Get('payment-method/:id')
  findOnePaymentMethod(@Param('id') id: string) {
    return this.stripePaymentGatewayService.findOnePaymentMethod(id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles(Role.ADMIN, Role.SUPERUSER)
  @Delete('payment-method/:id')
  removePaymentMethod(@Param('id') id: string) {
    return this.stripePaymentGatewayService.removePaymentMethod(id);
  }
}
