import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { use } from 'passport';
import { Expense } from 'src/expenses/entities/expense.entity';
import { Income } from 'src/incomes/entities/income.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import {
  allMonthExpense,
  allMonthsIncome,
  converShamsiToGregorian,
} from './helpers/conver-shamsi-to-gregorian';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Income)
    private incomesRepository: Repository<Income>,
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
  ) {}

  async getWeeklyIncomeReport(year: number, month: number, user: User) {
    const { startDate, endDate } = converShamsiToGregorian(month, year);

    const weeklyReport = await this.incomesRepository
      .createQueryBuilder('income')
      .select([
        `CASE 
        WHEN TO_CHAR(income.date AT TIME ZONE 'UTC', 'YYYY-MM-DD')::date BETWEEN :startDate AND :startDate + INTERVAL '6 days' THEN 'Week 1'
        WHEN TO_CHAR(income.date AT TIME ZONE 'UTC', 'YYYY-MM-DD')::date BETWEEN :startDate + INTERVAL '7 days' AND :startDate + INTERVAL '13 days' THEN 'Week 2'
        WHEN TO_CHAR(income.date AT TIME ZONE 'UTC', 'YYYY-MM-DD')::date BETWEEN :startDate + INTERVAL '14 days' AND :startDate + INTERVAL '20 days' THEN 'Week 3'
        WHEN TO_CHAR(income.date AT TIME ZONE 'UTC', 'YYYY-MM-DD')::date BETWEEN :startDate + INTERVAL '21 days' AND :startDate + INTERVAL '27 days' THEN 'Week 4'
        ELSE 'Week 5'
      END AS week`,
        `COALESCE(SUM(income.price), 0) AS totalIncome`,
      ])
      .where(`income.date BETWEEN :startDate AND :endDate`, {
        startDate,
        endDate,
      })
      .andWhere('income.userId = :userId', { userId: user.id })
      .groupBy(`week`)
      .orderBy(`week`, 'ASC')
      .getRawMany();

    const allWeeks = [
      { week: 'Week 1', totalIncome: 0 },
      { week: 'Week 2', totalIncome: 0 },
      { week: 'Week 3', totalIncome: 0 },
      { week: 'Week 4', totalIncome: 0 },
      { week: 'Week 5', totalIncome: 0 },
    ];

    weeklyReport.forEach((data) => {
      const index = allWeeks.findIndex((w) => w.week === data.week);
      if (index !== -1) {
        allWeeks[index].totalIncome = data.totalincome;
      }
    });
    return allWeeks;
  }

  async getMonthlyIncomeReport(shamsiYear: number, user: User) {
    const allMonths = allMonthsIncome;
    const monthlyReports = await Promise.all(
      allMonths.map(async (_, index) => {
        const shamsiMonth = index + 1;
        const { startDate, endDate } = converShamsiToGregorian(
          shamsiMonth,
          shamsiYear,
        );

        const monthlyReport = await this.incomesRepository
          .createQueryBuilder('income')
          .select([`COALESCE(SUM(income.price), 0) AS totalIncome`])
          .where(`income.date >= :startDate AND income.date <= :endDate`, {
            startDate,
            endDate,
          })
          .andWhere('income.userId = :userId', { userId: user.id })
          .getRawOne();

        return {
          month: shamsiMonth,
          totalIncome: Number(monthlyReport?.totalincome || 0),
        };
      }),
    );

    monthlyReports.forEach((report) => {
      allMonths[report.month - 1].totalIncome = report.totalIncome;
    });

    const totalIncomeInYear = allMonths.reduce(
      (total, value) => total + value.totalIncome,
      0,
    );

    return {
      allMonths,
      totalIncomeInYear,
    };
  }

  async getWeeklyExpenseReport(year: number, month: number, user: User) {
    const { startDate, endDate } = converShamsiToGregorian(month, year);

    const weeklyReport = await this.expensesRepository
      .createQueryBuilder('expense')
      .select([
        `CASE 
        WHEN TO_CHAR(expense.date AT TIME ZONE 'UTC', 'YYYY-MM-DD')::date BETWEEN :startDate AND :startDate + INTERVAL '6 days' THEN 'Week 1'
        WHEN TO_CHAR(expense.date AT TIME ZONE 'UTC', 'YYYY-MM-DD')::date BETWEEN :startDate + INTERVAL '7 days' AND :startDate + INTERVAL '13 days' THEN 'Week 2'
        WHEN TO_CHAR(expense.date AT TIME ZONE 'UTC', 'YYYY-MM-DD')::date BETWEEN :startDate + INTERVAL '14 days' AND :startDate + INTERVAL '20 days' THEN 'Week 3'
        WHEN TO_CHAR(expense.date AT TIME ZONE 'UTC', 'YYYY-MM-DD')::date BETWEEN :startDate + INTERVAL '21 days' AND :startDate + INTERVAL '27 days' THEN 'Week 4'
        ELSE 'Week 5'
      END AS week`,
        `COALESCE(SUM(expense.price), 0) AS totalExpense`,
      ])
      .where(`expense.date BETWEEN :startDate AND :endDate`, {
        startDate,
        endDate,
      })
      .andWhere('expense.userId = :userId', { userId: user.id })
      .groupBy(`week`)
      .orderBy(`week`, 'ASC')
      .getRawMany();

    const allWeeks = [
      { week: 'Week 1', totalExpense: 0 },
      { week: 'Week 2', totalExpense: 0 },
      { week: 'Week 3', totalExpense: 0 },
      { week: 'Week 4', totalExpense: 0 },
      { week: 'Week 5', totalExpense: 0 },
    ];

    weeklyReport.forEach((data) => {
      const index = allWeeks.findIndex((w) => w.week === data.week);

      if (index !== -1) {
        allWeeks[index].totalExpense = data.totalexpense;
      }
    });
    return allWeeks;
  }

  async getMonthlyExpenseReport(shamsiYear: number, user: User) {
    const allMonths = allMonthExpense;
    const monthlyReports = await Promise.all(
      allMonths.map(async (_, index) => {
        const shamsiMonth = index + 1;
        const { startDate, endDate } = converShamsiToGregorian(
          shamsiMonth,
          shamsiYear,
        );

        const monthlyReport = await this.expensesRepository
          .createQueryBuilder('expense')
          .select([`COALESCE(SUM(expense.price), 0) AS totalExpense`])
          .where(`expense.date >= :startDate AND expense.date <= :endDate`, {
            startDate,
            endDate,
          })
          .andWhere('expense.userId = :userId', { userId: user.id })
          .getRawOne();

        return {
          month: shamsiMonth,
          totalExpense: Number(monthlyReport?.totalexpense || 0),
        };
      }),
    );

    monthlyReports.forEach((report) => {
      allMonths[report.month - 1].totalExpense = report.totalExpense;
    });

    const totalExpenseInYear = allMonths.reduce(
      (total, value) => total + value.totalExpense,
      0,
    );

    return {
      allMonths,
      totalExpenseInYear,
    };
  }

  async getMonthlySaveMoney(shamsiYear: number, user: User) {
    const allMonths = Array.from({ length: 12 }, (_, i) => ({
      month: String(i + 1).padStart(2, '0'),
      totalIncome: 0,
      totalExpense: 0,
      savings: 0,
    }));

    const monthlyReports = await Promise.all(
      allMonths.map(async (_, index) => {
        const shamsiMonth = index + 1;
        const { startDate, endDate } = converShamsiToGregorian(
          shamsiMonth,
          shamsiYear,
        );

        const incomeReport = await this.incomesRepository
          .createQueryBuilder('income')
          .select([`COALESCE(SUM(income.price), 0) AS totalIncome`])
          .where(`income.date >= :startDate AND income.date <= :endDate`, {
            startDate,
            endDate,
          })
          .andWhere('income.userId = :userId', { userId: user.id })
          .getRawOne();

        const expenseReport = await this.expensesRepository
          .createQueryBuilder('expense')
          .select([`COALESCE(SUM(expense.price), 0) AS totalExpense`])
          .where(`expense.date >= :startDate AND expense.date <= :endDate`, {
            startDate,
            endDate,
          })
          .andWhere('expense.userId = :userId', { userId: user.id })
          .getRawOne();

        return {
          month: shamsiMonth,
          totalIncome: Number(incomeReport?.totalincome || 0),
          totalExpense: Number(expenseReport?.totalexpense || 0),
        };
      }),
    );

    monthlyReports.forEach((report) => {
      allMonths[report.month - 1].totalIncome = report.totalIncome;
      allMonths[report.month - 1].totalExpense = report.totalExpense;
      allMonths[report.month - 1].savings =
        report.totalIncome - report.totalExpense;
    });

    return allMonths;
  }
}
