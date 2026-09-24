import { IsString, IsNotEmpty, IsBoolean, IsOptional, MaxLength, IsUrl } from 'class-validator';

export class CreateQrDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name!: string;

  @IsString()
  @IsNotEmpty()
  qrTypeId!: string;

  @IsBoolean()
  @IsOptional()
  isDynamic?: boolean = true;

  @IsUrl()
  @IsNotEmpty()
  targetUrl!: string;
}
