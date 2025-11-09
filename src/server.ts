/* eslint-disable no-console */
import { Server } from "http";
import app from "./app";
import { PrismaClient } from "@prisma/client";
import { seedSuperAdmin } from "./helpers/seedSuperAdmin";
import { envVars } from "./config/env";

const prisma = new PrismaClient();
let server: Server;

const startServer = async () => {
  try {
    // ✅ Prisma connection
    await prisma.$connect();
    console.log("Database connected via Prisma");

    // ✅ Start Express server
    server = app.listen(envVars.PORT, () => {
      console.log(`Server running on port ${envVars.PORT}`);
    });
  } catch (err) {
    console.error("Server start error:", err);
  }
};

(async () => {
  await startServer();
  await seedSuperAdmin(prisma); // Prisma client pass করা হলো
})();

// 🔹 Graceful shutdown
const gracefulShutdown = async () => {
  console.log("Shutting down server...");
  if (server) {
    server.close(async () => {
      await prisma.$disconnect();
      process.exit(1);
    });
  }
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
process.on("unhandledRejection", gracefulShutdown);
process.on("uncaughtException", gracefulShutdown);
