import { PartialType } from '@nestjs/mapped-types';
import { CreateStripeChargeDto, CreateStripeCustomerDto, CreateStripeTokenCardDto } from './create-stripe_payment_gateway.dto';

export class UpdateStripeCustomerDto extends PartialType(CreateStripeCustomerDto) {}
export class UpdateStripeChargeDto extends PartialType(CreateStripeChargeDto) {}
export class UpdateStripeTokenCard extends PartialType(CreateStripeTokenCardDto) {}