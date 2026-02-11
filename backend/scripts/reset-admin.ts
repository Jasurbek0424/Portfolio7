/**
 * Reset admin password to match .env ADMIN_EMAIL and ADMIN_PASSWORD.
 * Run from backend folder: npx tsx scripts/reset-admin.ts
 */
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.ADMIN_EMAIL || 'admin@portfolio.com').toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

  const hashed = await bcrypt.hash(password, 12);

  let admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) {
    const first = await prisma.adminUser.findFirst();
    if (first) {
      admin = first;
      console.log('   Found existing admin with different email:', first.email);
    }
  }

  if (!admin) {
    await prisma.adminUser.create({
      data: { email, password: hashed, role: 'admin' },
    });
    console.log('✅ Admin created:', email);
  } else {
    await prisma.adminUser.update({
      where: { id: admin.id },
      data: { password: hashed },
    });
    console.log('✅ Admin password reset for:', admin.email);
  }

  const loginEmail = admin?.email ?? email;
  console.log('   Login with email:', loginEmail);
  console.log('   Password: (value of ADMIN_PASSWORD in .env = ChangeMe123!)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
