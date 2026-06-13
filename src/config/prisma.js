const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');

// Setup connection pool and adapter
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

let prisma;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient({ adapter });
} else {
  // Prevent multiple Prisma instances in development due to hot reloading
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      adapter,
      log: ['query', 'info', 'warn', 'error'],
    });
  }
  prisma = global.prisma;
}

module.exports = prisma;