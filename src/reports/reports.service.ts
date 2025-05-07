import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { use } from 'passport';
import { Expense } from 'src/expenses/entities/expense.entity';
import { Income } from 'src/incomes/entities/income.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Income)
    private incomesRepository: Repository<Income>,
    @InjectRepository(Expense)
    private expensesRepository: Repository<Expense>,
  ) {}

  async getWeeklyIncomeReport(year: number, month: number, user: User) {
    const weeklyReport = await this.incomesRepository
      .createQueryBuilder('income')
      .select([
        `CASE 
        WHEN EXTRACT(DAY FROM income.date) BETWEEN 1 AND 7 THEN 'Week 1'
        WHEN EXTRACT(DAY FROM income.date) BETWEEN 8 AND 14 THEN 'Week 2'
        WHEN EXTRACT(DAY FROM income.date) BETWEEN 15 AND 21 THEN 'Week 3'
        WHEN EXTRACT(DAY FROM income.date) BETWEEN 22 AND 28 THEN 'Week 4'
        ELSE 'Week 5'
      END AS week`,
        `COALESCE(SUM(income.price), 0) AS totalIncome`,
      ])
      .where(`EXTRACT(YEAR FROM income.date) = :year`, { year })
      .andWhere(`EXTRACT(MONTH FROM income.date) = :month`, { month })
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

  async getMonthlyIncomeReport(year: number, user: User) {
    const monthlyReports = await this.incomesRepository
      .createQueryBuilder('income')
      .select([
        `TO_CHAR(income.date, 'YYYY-MM') AS month`,
        `COALESCE(SUM(income.price), 0) AS totalIncome`,
      ])
      .where(`EXTRACT(YEAR FROM income.date) = :year`, { year })
      .andWhere('income.userId = :userId', { userId: user.id })
      .groupBy(`TO_CHAR(income.date, 'YYYY-MM')`)
      .orderBy(`month`, 'ASC')
      .getRawMany();

    const allMonths = [
      { month: '01', totalIncome: 0 },
      { month: '02', totalIncome: 0 },
      { month: '03', totalIncome: 0 },
      { month: '04', totalIncome: 0 },
      { month: '05', totalIncome: 0 },
      { month: '06', totalIncome: 0 },
      { month: '07', totalIncome: 0 },
      { month: '08', totalIncome: 0 },
      { month: '09', totalIncome: 0 },
      { month: '10', totalIncome: 0 },
      { month: '11', totalIncome: 0 },
      { month: '12', totalIncome: 0 },
    ];

    monthlyReports.forEach((data: any) => {
      const index = allMonths.findIndex(
        (m) => m.month === data.month.split('-')[1],
      );

      if (index !== -1) {
        allMonths[index].totalIncome = data.totalincome;
      }
    });

    const totalIncomeInYear = allMonths.reduce(
      (total, value) => total + Number(value.totalIncome),
      0,
    );
    return {
      allMonths,
      totalIncomeInYear,
    };
  }

  async getWeeklyExpenseReport(year: number, month: number, user: User) {
    const weeklyReport = await this.expensesRepository
      .createQueryBuilder('expense')
      .select([
        `CASE 
        WHEN EXTRACT(DAY FROM expense.date) BETWEEN 1 AND 7 THEN 'Week 1'
        WHEN EXTRACT(DAY FROM expense.date) BETWEEN 8 AND 14 THEN 'Week 2'
        WHEN EXTRACT(DAY FROM expense.date) BETWEEN 15 AND 21 THEN 'Week 3'
        WHEN EXTRACT(DAY FROM expense.date) BETWEEN 22 AND 28 THEN 'Week 4'
        ELSE 'Week 5'
      END AS week`,
        `COALESCE(SUM(expense.price), 0) AS totalExpense`,
      ])
      .where(`EXTRACT(YEAR FROM expense.date) = :year`, { year })
      .andWhere(`EXTRACT(MONTH FROM expense.date) = :month`, { month })
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

  async getMonthlyExpenseReport(year: number, user: User) {
    const monthlyReports = await this.expensesRepository
      .createQueryBuilder('expense')
      .select([
        `TO_CHAR(expense.date, 'YYYY-MM') AS month`,
        `COALESCE(SUM(expense.price), 0) AS totalExpense`,
      ])
      .where(`EXTRACT(YEAR FROM expense.date) = :year`, { year })
      .andWhere('expense.userId = :userId', { userId: user.id })
      .groupBy(`TO_CHAR(expense.date, 'YYYY-MM')`)
      .orderBy(`month`, 'ASC')
      .getRawMany();

    const allMonths = [
      { month: '01', totalExpense: 0 },
      { month: '02', totalExpense: 0 },
      { month: '03', totalExpense: 0 },
      { month: '04', totalExpense: 0 },
      { month: '05', totalExpense: 0 },
      { month: '06', totalExpense: 0 },
      { month: '07', totalExpense: 0 },
      { month: '08', totalExpense: 0 },
      { month: '09', totalExpense: 0 },
      { month: '10', totalExpense: 0 },
      { month: '11', totalExpense: 0 },
      { month: '12', totalExpense: 0 },
    ];

    monthlyReports.forEach((data: any) => {
      const index = allMonths.findIndex(
        (m) => m.month === data.month.split('-')[1],
      );

      if (index !== -1) {
        allMonths[index].totalExpense = data.totalexpense;
      }
    });

    const totalExpenseInYear = allMonths.reduce(
      (total, value) => total + Number(value.totalExpense),
      0,
    );
    return {
      allMonths,
      totalExpenseInYear,
    };
  }

  async getMonthlySaveMoney(year: number, user: User) {
    const incomeReport = await this.incomesRepository
      .createQueryBuilder('income')
      .select([
        `TO_CHAR(income.date, 'MM') AS month`,
        `COALESCE(SUM(income.price), 0) AS totalIncome`,
      ])
      .where(`EXTRACT(YEAR FROM income.date) = :year`, { year })
      .andWhere('income.userId = :userId', { userId: user.id })
      .groupBy(`TO_CHAR(income.date, 'MM')`)
      .orderBy(`month`, 'ASC')
      .getRawMany();

    const expenseReport = await this.expensesRepository
      .createQueryBuilder('expense')
      .select([
        `TO_CHAR(expense.date, 'MM') AS month`,
        `COALESCE(SUM(expense.price), 0) AS totalExpense`,
      ])
      .where(`EXTRACT(YEAR FROM expense.date) = :year`, { year })
      .andWhere('expense.userId = :userId', { userId: user.id })
      .groupBy(`TO_CHAR(expense.date, 'MM')`)
      .orderBy(`month`, 'ASC')
      .getRawMany();

    const allMonths = Array.from({ length: 12 }, (_, i) => ({
      month: String(i + 1).padStart(2, '0'),
      totalIncome: 0,
      totalExpense: 0,
      savings: 0,
    }));

    incomeReport.forEach((data) => {
      const index = allMonths.findIndex((m) => m.month === data.month);
      if (index !== -1) {
        allMonths[index].totalIncome = Number(data.totalincome) || 0;
      }
    });

    expenseReport.forEach((data) => {
      const index = allMonths.findIndex((m) => m.month === data.month);
      if (index !== -1) {
        allMonths[index].totalExpense = Number(data.totalexpense) || 0;
      }
    });

    allMonths.forEach((month) => {
      month.savings = month.totalIncome - month.totalExpense;
    });

    return allMonths;
  }
}
