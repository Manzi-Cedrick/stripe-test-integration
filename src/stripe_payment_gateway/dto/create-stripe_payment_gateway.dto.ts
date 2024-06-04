import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
class DestinationDto {
    @IsString()
    account: string;

    @IsNumber()
    amount: number;
}

class TransferDataDto {
    @IsString()
    destination: string;

    @IsNumber()
    amount: number;
}
export class CreateStripeChargeDto {
    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    customer: string;

    @IsNumber()
    amount: number;

    @IsString()
    currency: string;

    @IsString()
    @IsOptional()
    receipt_email?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @ValidateNested()
    @Type(() => DestinationDto)
    @IsOptional()
    destination?: DestinationDto;

    @ValidateNested()
    @Type(() => TransferDataDto)
    @IsOptional()
    transfer_data?: TransferDataDto;
}

export class CreateStripeCustomerDto {
    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    phone?: string;

    @IsOptional()
    address: IAddress
}

class CardDto {
    @IsString()
    number: string;

    @IsNumber()
    exp_month: number;

    @IsNumber()
    exp_year: number;

    @IsString()
    cvc: string;
}
export class CreateStripeCardTokenPaymentMethodDto {
    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    type: PaymentMethodType;

    @ValidateNested()
    @Type(() => CardDto)
    card: CardDto;
}