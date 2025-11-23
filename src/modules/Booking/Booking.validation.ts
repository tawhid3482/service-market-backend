import { z } from "zod";

export const BookingStatusEnum = z.enum([
  "Pending",
  "Upcoming",
  "Delivered",
  "Cancelled",
  "Unpaid",
  "OnHold",
]);

export const MethodEnum = z.enum([
  "Card",
  "CashOnDelivery",
]);

export const BookingSchema = z.object({
  serviceName: z.string().min(1, "Service name is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  address: z.string().min(1, "Address is required"),
  offer: z.string().min(1, "Offer is required"),

  paymentMethod: MethodEnum.optional(),

  serviceCharge: z.number().nonnegative(),
  serviceFee: z.number().nonnegative(),
  discount: z.number().nonnegative(),
  subTotal: z.number().nonnegative(),
  vat: z.number().nonnegative().default(0),
  totalPay: z.number().nonnegative(),

  status: BookingStatusEnum.default("Upcoming"),
});
