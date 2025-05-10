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
