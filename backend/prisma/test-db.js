require("dotenv").config();

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  await prisma.completion.deleteMany();
  await prisma.habit.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      email: "test@mail.com",
      password: "password-hash-palsu",
      name: "User Test",
    },
  });

  const habit = await prisma.habit.create({
    data: {
      title: "Minum air 2 liter",
      description: "Biar badan tetap segar",
      userId: user.id,
    },
  });

  const today = new Date().toISOString().split("T")[0];

  const completion = await prisma.completion.create({
    data: {
      habitId: habit.id,
      date: today,
    },
  });

  console.log("✅ User berhasil dibuat:");
  console.log(user);

  console.log("✅ Habit berhasil dibuat:");
  console.log(habit);

  console.log("✅ Completion berhasil dibuat:");
  console.log(completion);

  const habits = await prisma.habit.findMany({
    include: {
      completions: true,
      user: true,
    },
  });

  console.log("📦 Data lengkap setelah insert:");
  console.log(JSON.stringify(habits, null, 2));
}

// Jalankan fungsi utama
main()
  .catch((error) => {
    console.error("❌ Error saat test database:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
