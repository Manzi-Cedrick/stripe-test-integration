import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config'
import { StripePaymentGatewayModule } from './stripe_payment_gateway/stripe_payment_gateway.module';

@Module({
  imports: [UserModule, AuthModule, ConfigModule.forRoot(), StripePaymentGatewayModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
