import { PrismaClient } from "@prisma/client";
import AppError from "../../helpers/AppError";
import { ICreateClassSchedule } from "../../types/class.types";

const prisma = new PrismaClient();

export const classServices = {
  createClassSchedule: async (userId: string, data: ICreateClassSchedule) => {
    const trainer = await prisma.trainer.findUnique({
      where: { id: data.trainerId },
    });
    if (!trainer) throw new AppError(404, "Trainer not found");

    const classDate = new Date(data.date);
    const startTime = new Date(data.startTime);
    const endTime = new Date(startTime.getTime() + 2 * 60 * 60 * 1000); // 2 hours class

    const sameDaySchedules = await prisma.schedule.count({
      where: {
        trainerId: data.trainerId,
        date: classDate,
      },
    });
    if (sameDaySchedules >= 5) {
      throw new AppError(
        400,
        "Schedule limit exceeded: Maximum 5 classes per day."
      );
    }

    const overlap = await prisma.schedule.findFirst({
      where: {
        trainerId: data.trainerId,
        AND: [{ startTime: { lt: endTime } }, { endTime: { gt: startTime } }],
      },
    });
    if (overlap) {
      throw new AppError(400, "Trainer already has a class at this time slot.");
    }

    const schedule = await prisma.schedule.create({
      data: {
        trainerId: data.trainerId,
        date: classDate,
        startTime,
        endTime,
        createdById: userId,
      },
      include: { trainer: { include: { user: true } } },
    });

    // password remove
    if (schedule.trainer?.user) {
      const { password, ...safeUser } = schedule.trainer.user;
      schedule.trainer.user = safeUser as any;
    }

    return schedule;
  },

  getAllSchedules: async () => {
    const schedules = await prisma.schedule.findMany({
      include: { trainer: { include: { user: true } }, bookings: true },
    });

    // password remove for all schedules
    const safeSchedules = schedules.map((schedule) => {
      if (schedule.trainer?.user) {
        const { password, ...safeUser } = schedule.trainer.user;
        schedule.trainer.user = safeUser as any;
      }
      return schedule;
    });

    return safeSchedules;
  },

  getScheduleById: async (id: string) => {
    const schedule = await prisma.schedule.findUnique({
      where: { id },
      include: { trainer: { include: { user: true } }, bookings: true },
    });
    if (!schedule) throw new AppError(404, "Class schedule not found");

    // password remove
    if (schedule.trainer?.user) {
      const { password, ...safeUser } = schedule.trainer.user;
      schedule.trainer.user = safeUser as any;
    }

    return schedule;
  },

  deleteSchedule: async (id: string) => {
    const schedule = await prisma.schedule.findUnique({ where: { id } });
    if (!schedule) throw new AppError(404, "Class schedule not found");

    return prisma.schedule.delete({ where: { id } });
  },
};
