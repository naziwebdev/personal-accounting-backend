import * as moment from 'moment-jalaali';

export const converShamsiToGregorian = (month: number, year: number) => {
  const startDate = moment(`${year}/${month}/01`, 'jYYYY/jM/jD').format(
    'YYYY-MM-DD',
  );
  const endDate = moment(`${year}/${month}/01`, 'jYYYY/jM/jD')
    .endOf('jMonth')
    .format('YYYY-MM-DD');
  return { startDate, endDate };
};

export const allMonthsIncome = [
  { month: '01', totalIncome: 0 }, // Farvardin
  { month: '02', totalIncome: 0 }, // Ordibehesht
  { month: '03', totalIncome: 0 }, // Khordad
  { month: '04', totalIncome: 0 }, // Tir
  { month: '05', totalIncome: 0 }, // Mordad
  { month: '06', totalIncome: 0 }, // Shahrivar
  { month: '07', totalIncome: 0 }, // Mehr
  { month: '08', totalIncome: 0 }, // Aban
  { month: '09', totalIncome: 0 }, // Azar
  { month: '10', totalIncome: 0 }, // Dey
  { month: '11', totalIncome: 0 }, // Bahman
  { month: '12', totalIncome: 0 }, // Esfand
];

export const allMonthExpense = [
  { month: '01', totalExpense: 0 }, // Farvardin
  { month: '02', totalExpense: 0 }, // Ordibehesht
  { month: '03', totalExpense: 0 }, // Khordad
  { month: '04', totalExpense: 0 }, // Tir
  { month: '05', totalExpense: 0 }, // Mordad
  { month: '06', totalExpense: 0 }, // Shahrivar
  { month: '07', totalExpense: 0 }, // Mehr
  { month: '08', totalExpense: 0 }, // Aban
  { month: '09', totalExpense: 0 }, // Azar
  { month: '10', totalExpense: 0 }, // Dey
  { month: '11', totalExpense: 0 }, // Bahman
  { month: '12', totalExpense: 0 }, // Esfand
];
