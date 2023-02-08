import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
async function main() {
  for (let i = 0; i < 50; i++) {
    await prisma.owner.create({
      data: {
        name: faker.name.fullName(),
        mobile: faker.phone.number(),
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

