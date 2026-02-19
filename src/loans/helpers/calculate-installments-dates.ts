import { LoanPeriodEnum } from '../enums/loan-period-enum';
import * as moment from 'moment-jalaali';

export const calculateInstallmentsDates = (
  firstDate: Date,
  periodLoan: LoanPeriodEnum,
  installmentCount: number,
): Date[] => {

  const dates: Date[] = [];

  // Convert first date to Jalali moment
  let current = moment(firstDate)

  for (let i = 0; i < installmentCount; i++) {

    // Convert back to Gregorian Date for DB / API
    dates.push(current.toDate());

    switch (periodLoan) {
      case LoanPeriodEnum.MONTHLY:
        current = current.add(1, 'jMonth'); // 🔥 CRITICAL
        break;

      case LoanPeriodEnum.WEEKLY:
        current = current.add(7, 'day');
        break;

      case LoanPeriodEnum.YEARLY:
        current = current.add(1, 'jYear');
        break;
    }
  }

  return dates;
};

