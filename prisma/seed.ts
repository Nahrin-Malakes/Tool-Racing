import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
async function main() {
  for (let i = 0; i < 50; i++) {
    await prisma.vehicle.create({
      data: {
        model: `${faker.vehicle.manufacturer()} ${faker.vehicle.model()}`,
        year: faker.date.past().getFullYear().toString(),
      },
    });
  }
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

