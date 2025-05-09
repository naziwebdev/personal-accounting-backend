import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment-jalaali';

@Injectable()
export class TransformDateInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const convertedData = this.convertDates(data, new WeakSet());
        return convertedData;
      }),
    );
  }

  private convertDates(data: any, seen: WeakSet<object>): any {
    if (!data || typeof data !== 'object' || data === null) return data;

    if (seen.has(data)) return data;
    seen.add(data);

    if (Array.isArray(data)) {
      return data.map((item) => this.convertDates(item, seen));
    }

    const dateFields = [
      'createdAt',
      'updatedAt',
      'issued',
      'due_date',
      'date',
      'firstDateInstallment',
      'dueDates',
    ];

    for (const key of Object.keys(data)) {
      if (dateFields.includes(key) && this.isDate(data[key])) {
        let parsedDate;
        if (data[key] instanceof Date) {
          parsedDate = moment(data[key]); // Convert Date object
        } else {
          parsedDate = moment(data[key], 'YYYY-MM-DD HH:mm:ss.SSSSSS'); // Convert non-ISO string
        }

        if (parsedDate.isValid()) {
          data[key] = parsedDate.format('jYYYY/jMM/jDD HH:mm:ss'); // Convert to Shamsi
        } else {
          console.error(`❌ Invalid date format for ${key}: ${data[key]}`);
        }
      } else if (typeof data[key] === 'object' && data[key] !== null) {
        data[key] = this.convertDates(data[key], seen);
      }
    }

    return data;
  }

  private isDate(value: any): boolean {
    return (
      value instanceof Date ||
      (typeof value === 'string' && !isNaN(Date.parse(value)))
    );
  }
}
