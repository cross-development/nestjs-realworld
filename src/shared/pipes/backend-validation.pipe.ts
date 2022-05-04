// Core
import {
  HttpStatus,
  Injectable,
  HttpException,
  PipeTransform,
  ValidationError,
  ArgumentMetadata,
} from '@nestjs/common';
// Packages
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class BackendValidationPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    const object = plainToClass(metadata.metatype, value);

    if (typeof object !== 'object') {
      return value;
    }

    const errors = await validate(object);

    if (errors.length === 0) {
      return value;
    }

    const formatErrors = this.formatErrors(errors);

    throw new HttpException({ errors: formatErrors }, HttpStatus.UNPROCESSABLE_ENTITY);
  }

  formatErrors(errors: ValidationError[]) {
    return errors.reduce((acc, error) => {
      acc[error.property] = Object.values(error.constraints);

      return acc;
    }, {});
  }
}
