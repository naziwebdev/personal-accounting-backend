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
      return Math.floor(remainingAmount);

    case WatchlistWaitingPeriodEnum.WEEK:
      return Math.floor(remainingAmount / 7);

    case WatchlistWaitingPeriodEnum.MONTH:
      return Math.floor(remainingAmount / 30);

    case WatchlistWaitingPeriodEnum.YEAR:
      return Math.floor(remainingAmount / 365);

    default:
      return 0;
  }
};
