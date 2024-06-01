import { Test, TestingModule } from '@nestjs/testing';
import { StripePaymentGatewayService } from './stripe_payment_gateway.service';

describe('StripePaymentGatewayService', () => {
  let service: StripePaymentGatewayService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StripePaymentGatewayService],
    }).compile();

    service = module.get<StripePaymentGatewayService>(StripePaymentGatewayService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
