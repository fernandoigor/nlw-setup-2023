import { prisma } from "../../lib/prisma";

// interface CreateHabitInterface{
//     title: string;
//     created_at: string;
//     weekDays: weekDays
// }

export async function createHabit({ userId, title, created_at, weekDays }) {
  await prisma.habit.create({
    data: {
      user_id: userId,
      title,
      created_at,
      weekDays: {
        create: weekDays.map((weekDay) => {
          return {
            week_day: weekDay,
          };
        }),
      },
    },
  });
}
export async function PossibleHabits({ userId, date, weekDay }) {
  return await prisma.habit.findMany({
    where: {
      user_id: {
        equals: userId,
      },
      created_at: {
        lte: date,
      },
      weekDays: {
        some: {
          week_day: weekDay,
        },
      },
    },
  });
}
export async function CompletedHabits({ parsedDate }) {
  const day = await prisma.day.findFirst({
    where: {
      date: parsedDate.toDate(),
    },
    include: {
      dayHabits: true,
    },
  });
  return (
    day?.dayHabits.map((dayHabit) => {
      return dayHabit.habit_id;
    }) ?? []
  );
}
