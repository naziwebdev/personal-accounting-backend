import { WatchlistWaitingPeriodEnum } from '../enums/watchlist-waiting-period-enum';

export const calculateSavings = (
  totalPrice: number,
  period: WatchlistWaitingPeriodEnum,
  currentBudget: number,
) => {
  const remainingAmount = totalPrice - currentBudget;
  if (remainingAmount <= 0) {
    return 0;
  }

  switch (period) {
    case WatchlistWaitingPeriodEnum.DAY:
      return remainingAmount;

    case WatchlistWaitingPeriodEnum.WEEK:
      return remainingAmount / 7;

    case WatchlistWaitingPeriodEnum.MONTH:
      return remainingAmount / 30;

    case WatchlistWaitingPeriodEnum.YEAR:
      return remainingAmount / 365;

    default:
      return 0;
  }
};
