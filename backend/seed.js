const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt'); 

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding process...');

  // 1. Hash the password securely for authentication
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 2. Create a realistic test user (upsert prevents duplication errors)
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {}, 
    create: {
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword,
      defaultCurrency: 'INR'
    },
  });

  // 3. Create a default group to populate the dashboard UI
  const group = await prisma.group.create({
    data: {
      name: 'Goa Trip Expenses',
      baseCurrency: 'INR',
    }
  });

  // 4. Assign the user as a member of the newly created group
  await prisma.groupMember.create({
    data: {
      groupId: group.id,
      userId: user.id
    }
  });

  console.log('\n✅ Database seeding completed successfully!');
  console.log('------------------------------------------------');
  console.log('🧑‍💻 LOGIN DETAILS (Use these on the Frontend):');
  console.log(`👉 Email: test@example.com`);
  console.log(`👉 Password: password123`);
  console.log('------------------------------------------------');
  console.log('📁 FOR FRONTEND DASHBOARD / API CALLS:');
  console.log(`Replace hardcoded "group-123" in your frontend code with this valid UUID:`);
  console.log(`👉 ${group.id}`);
  console.log('------------------------------------------------\n');
}

main()
  .catch((e) => {
    // Log any errors that occur during the seeding process
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    // Ensure the database connection is closed safely
    await prisma.$disconnect();
  });