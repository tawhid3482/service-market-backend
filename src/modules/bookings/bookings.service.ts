import { PrismaClient, Status } from "@prisma/client";
import AppError from "../../helpers/AppError";

const prisma = new PrismaClient();

export const bookingServices = {
  createBooking: async (traineeId: string, classId: string) => {
    const schedule = await prisma.schedule.findUnique({
      where: { id: classId },
      include: { bookings: true },
    });
    if (!schedule) throw new AppError(404, "Class schedule not found");

    const trainee = await prisma.user.findUnique({
      where: { id: traineeId },
      select: { id: true, name: true, email: true, role: true }, // password hide
    });
    if (!trainee) throw new AppError(404, "Trainee not found");

    if (schedule.bookings.length >= schedule.capacity) {
      throw new AppError(
        400,
        `Class schedule is full. Maximum ${schedule.capacity} trainees allowed per schedule.`
      );
    }

    const overlappingBooking = await prisma.booking.findFirst({
      where: {
        traineeId,
        schedule: {
          startTime: schedule.startTime,
          endTime: schedule.endTime,
        },
      },
    });
    if (overlappingBooking)
      throw new AppError(400, "You already have a booking at this time slot.");

    const booking = await prisma.booking.create({
      data: {
        scheduleId: classId,
        traineeId,
        status: Status.CONFIRMED,
      },
    });

    // fetch full booking with schedule + trainer + user but hide password
    const fullBooking = await prisma.booking.findUnique({
      where: { id: booking.id },
      include: {
        schedule: {
          include: {
            trainer: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return { ...fullBooking, trainee }; 
  },

  cancelBooking: async (bookingId: string, traineeId: string) => {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });
    if (!booking) throw new AppError(404, "Booking not found");
    if (booking.traineeId !== traineeId)
      throw new AppError(403, "You can only cancel your own booking");

    return prisma.booking.update({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });
  },

  getBookingsByTrainee: async (traineeId: string) => {
    const bookings = await prisma.booking.findMany({
      where: { traineeId },
      include: {
        schedule: {
          include: {
            trainer: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // attach trainee object separately (password hidden)
    const trainee = await prisma.user.findUnique({
      where: { id: traineeId },
      select: { id: true, name: true, email: true, role: true },
    });

    return bookings.map((b) => ({ ...b, trainee }));
  },
};
