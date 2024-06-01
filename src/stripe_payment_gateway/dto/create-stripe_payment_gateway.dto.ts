import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateStripeChargeDto {
    @IsString()
    @IsOptional()
    stripe_customer_id?: string;

    @IsString()
    @IsOptional()
    stripe_card?: string;

    @IsString()
    @IsOptional()
    amount?: string;

    @IsString()
    @IsOptional()
    currency?: string;

    @IsString()
    @IsOptional()
    receipt_email?: string;

    @IsString()
    @IsOptional()
    description?: string;
}

export class CreateStripeCustomerDto {
    @IsString()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;
}

export class CreateStripeTokenCardDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    number?: string;

    @IsNumber()
    @IsOptional()
    exp_month?: number;

    @IsString()
    @IsNumber()
    exp_year?: number;

    @IsString()
    @IsOptional()
    cvc?: string;

    @IsString()
    @IsOptional()
    customer_id?: string;
}