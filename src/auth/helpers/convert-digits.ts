export const convertPersianToEnglishDigits = (phone: string) => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  const englishDigits = '0123456789';

  return phone.replace(
    /[۰-۹]/g,
    (digit) => englishDigits[persianDigits.indexOf(digit)],
  );
};
