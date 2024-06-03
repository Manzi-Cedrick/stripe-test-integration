import { Module } from '@nestjs/common';
import { StripePaymentGatewayService } from './stripe_payment_gateway.service';
import { StripePaymentGatewayController } from './stripe_payment_gateway.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [ConfigModule],
  controllers: [StripePaymentGatewayController],
  providers: [
    {
      provide: 'STRIPE_API_KEY',
      useFactory: (configService: ConfigService) => configService.get<string>('STRIPE_API_KEY'),
      inject: [ConfigService] 
    },
    StripePaymentGatewayService,
    PrismaService
  ],
  exports: [StripePaymentGatewayService]
})
export class StripePaymentGatewayModule {}


