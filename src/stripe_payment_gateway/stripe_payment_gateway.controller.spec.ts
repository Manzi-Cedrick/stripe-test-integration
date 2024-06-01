import { Test, TestingModule } from '@nestjs/testing';
import { StripePaymentGatewayController } from './stripe_payment_gateway.controller';
import { StripePaymentGatewayService } from './stripe_payment_gateway.service';

describe('StripePaymentGatewayController', () => {
  let controller: StripePaymentGatewayController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StripePaymentGatewayController],
      providers: [StripePaymentGatewayService],
    }).compile();

    controller = module.get<StripePaymentGatewayController>(StripePaymentGatewayController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
