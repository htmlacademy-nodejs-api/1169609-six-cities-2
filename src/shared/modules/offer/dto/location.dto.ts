import { IsNumber } from 'class-validator';

export class LocationDto {
  @IsNumber({}, { message: 'Latitude must be a valid number' })
  public latitude!: number;

  @IsNumber({}, { message: 'Longitude must be a valid number' })
  public longitude!: number;
}
