import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
      console.log();
      if (index !== -1) {
        allWeeks[index].totalIncome = data.totalincome;
      }
    });
    return allWeeks;
  }
}
