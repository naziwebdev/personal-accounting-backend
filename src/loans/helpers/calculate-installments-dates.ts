import { LoanPeriodEnum } from '../enums/loan-period-enum';

export const calculateInstallmentsDates = (
  firstDate: Date,
  periodLoan: LoanPeriodEnum,
  installmentCount: number,
): Date[] => {
  const installmentDates: Date[] = [];
  let currentDate = new Date(firstDate);

  installmentDates.push(new Date(firstDate));

  for (let i = 1; i < installmentCount; i++) {
    switch (periodLoan) {
      case LoanPeriodEnum.WEEKLY:
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case LoanPeriodEnum.MONTHLY:
        currentDate.setMonth(currentDate.getMonth() + 1);
        break;
      case LoanPeriodEnum.YEARLY:
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        break;
      default:
        throw new Error('Invalid period type');
    }

    installmentDates.push(new Date(currentDate));
  }

  return installmentDates;
};
