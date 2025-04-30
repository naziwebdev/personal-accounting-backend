import {
    IsString,
    IsNotEmpty,
    IsEnum,
  } from 'class-validator';
  import { CheckStatusEnum } from '../enums/check-status-enum';
  
  export class UpdateStatusCheckDto {

    @IsEnum(CheckStatusEnum, {
      message: 'status must be pendding /paid/returned',
    })
    @IsNotEmpty({ message: 'status is required' })
    @IsString()
    status: CheckStatusEnum;

  }
  