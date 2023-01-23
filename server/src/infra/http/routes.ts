import dayjs from "dayjs";
import { FastifyInstance } from "fastify";
import { z } from "zod";
import {
  CompletedHabits,
  createHabit,
  PossibleHabits,
} from "../../application/habit/habit-services";
import { prisma } from "../../lib/prisma";

export async function appRoutes(app: FastifyInstance) {
  app.post(
    "/habits",
    {
      onRequest: [app.authenticate],
    },
    async (request) => {
      const createHabitBody = z.object({
        title: z.string(),
        weekDays: z.array(z.number().min(0).max(6)),
      });

      const { title, weekDays } = createHabitBody.parse(request.body);

      const { userId } = request.headers;

      const today = dayjs().startOf("day").toDate();

      // const userId =

      await createHabit({
        userId,
        title,
        created_at: today,
        weekDays: weekDays,
      });

      // await prisma.habit.create({
      //   data: {
      //     title,
      //     created_at: today,
      //     weekDays: {
      //       create: weekDays.map((weekDay) => {
      //         return {
      //           week_day: weekDay,
      //         };
      //       }),
      //     },
      //   },
      // });
    }
  );

  app.get(
    "/day",
    {
      onRequest: [app.authenticate],
    },
    async (request) => {
      const getDayParams = z.object({
        date: z.coerce.date(),
      });

      const { date } = getDayParams.parse(request.query);

      const { userId } = request.headers;

      const parsedDate = dayjs(date).startOf("day");
      const weekDay = parsedDate.get("day");

      const possibleHabits = await PossibleHabits({ userId, date, weekDay });
      const completedHabits = await CompletedHabits({ parsedDate });

      return {
        possibleHabits,
        completedHabits,
      };
    }
  );

  app.patch(
    "/habits/:id/toggle",
    {
      onRequest: [app.authenticate],
    },
    async (request) => {
      const toggleHabitParams = z.object({
        id: z.string().uuid(),
      });

      const { id } = toggleHabitParams.parse(request.params);

      const today = dayjs().startOf("day").toDate();

      let day = await prisma.day.findUnique({
        where: {
          date: today,
        },
      });

      if (!day) {
        day = await prisma.day.create({
          data: {
            date: today,
          },
        });
      }

      const dayHabit = await prisma.dayHabit.findUnique({
        where: {
          day_id_habit_id: {
            day_id: day.id,
            habit_id: id,
          },
        },
      });

      if (dayHabit) {
        await prisma.dayHabit.delete({
          where: {
            id: dayHabit.id,
          },
        });
      } else {
        await prisma.dayHabit.create({
          data: {
            day_id: day.id,
            habit_id: id,
          },
        });
      }
    }
  );

  app.get(
    "/summary",
    {
      onRequest: [app.authenticate],
    },
    async (request) => {
      const { userId } = request.headers;
      const summary = await prisma.$queryRaw`
      SELECT 
        D.id, 
        D.date,
        (
          SELECT 
            cast(count(*) as float)
          FROM day_habits DH
          JOIN habits H ON (DH.habit_id = H.id)
          WHERE DH.day_id = D.id
          AND H.user_id = ${userId}
        ) as completed,
        (
          SELECT
            cast(count(*) as float)
          FROM habit_week_days HDW
          JOIN habits H
            ON (H.id = HDW.habit_id )
          WHERE
            HDW.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
            
            AND H.user_id = ${userId}
        ) as amount
      FROM days D
      GROUP BY D.id
    `;
      // AND H.created_at <= D.date

      return summary;
    }
  );
}
