import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
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
    @IsOptional()
    customer?: string;

    @IsString()
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