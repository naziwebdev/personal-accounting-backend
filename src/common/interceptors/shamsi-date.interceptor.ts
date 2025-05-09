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
        // console.log('Before conversion:', JSON.stringify(data, null, 2));
        const convertedData = this.convertDates(data, new WeakSet());
        // console.log(
        //   'After conversion:',
        //   JSON.stringify(convertedData, null, 2),
        // );
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
      'dueDates',
      'date',
      'firstDateInstallment',
      'dueDate',
    ];

    for (const key of Object.keys(data)) {
      if (dateFields.includes(key) && Array.isArray(data[key])) {
        // console.log(`✅ Converting array ${key}:`, data[key]);
        data[key] = data[key].map((date) => this.convertDate(date));
      } else if (dateFields.includes(key) && this.isDate(data[key])) {
        // console.log(`✅ Converting ${key}: ${data[key]}`);
        data[key] = this.convertDate(data[key]);
      } else if (typeof data[key] === 'object' && data[key] !== null) {
        data[key] = this.convertDates(data[key], seen);
      }
    }

    return data;
  }

  private convertDate(date: any): string {
    if (!date) return String(date);

    let parsedDate;
    if (date instanceof Date) {
      parsedDate = moment(date);
    } else if (
      typeof date === 'string' &&
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(date)
    ) {
      parsedDate = moment(date, 'YYYY-MM-DDTHH:mm:ss.SSSZ');
    } else if (
      typeof date === 'string' &&
      /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/.test(date)
    ) {
      parsedDate = moment(date, 'jYYYY/jMM/jDD HH:mm:ss');
    } else {
      console.error(`❌ Invalid date format: ${date}`);
      return String(date);
    }

    return parsedDate.isValid()
      ? parsedDate.format('jYYYY/jMM/jDD HH:mm:ss')
      : String(date);
  }

  private isDate(value: any): boolean {
    return (
      value instanceof Date ||
      (typeof value === 'string' &&
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value))
    );
  }
}
