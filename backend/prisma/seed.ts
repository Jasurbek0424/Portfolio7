import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@portfolio.com').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';

  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: 'admin',
    },
    update: {
      password: hashedPassword,
      role: 'admin',
    },
  });
  console.log('✅ Admin user synced:', adminEmail);

  // Seed sample resume sections
  const resumeSections = [
    {
      sectionKey: 'experience',
      titleEn: 'Experience',
      titleRu: 'Опыт',
      titleUz: 'Tajriba',
      contentEn: 'Your work experience in English...',
      contentRu: 'Ваш опыт работы на русском...',
      contentUz: "Ish tajribangiz o'zbekcha...",
      sortOrder: 0,
    },
    {
      sectionKey: 'education',
      titleEn: 'Education',
      titleRu: 'Образование',
      titleUz: "Ma'lumot",
      contentEn: 'Your education in English...',
      contentRu: 'Ваше образование на русском...',
      contentUz: "Ma'lumotingiz o'zbekcha...",
      sortOrder: 1,
    },
    {
      sectionKey: 'skills',
      titleEn: 'Skills',
      titleRu: 'Навыки',
      titleUz: 'Ko\'nikmalar',
      contentEn: 'Your skills in English...',
      contentRu: 'Ваши навыки на русском...',
      contentUz: "Ko'nikmalaringiz o'zbekcha...",
      sortOrder: 2,
    },
  ];

  for (const section of resumeSections) {
    await prisma.resumeSection.upsert({
      where: { sectionKey: section.sectionKey },
      create: section,
      update: section,
    });
  }
  console.log('✅ Resume sections seeded');

  // Seed default contacts (only if none exist)
  const existingContacts = await prisma.contact.count();
  if (existingContacts === 0) {
    await prisma.contact.createMany({
      data: [
        { type: 'email', icon: 'mail', value: 'jasurbekxakimbekov7766@gmail.com', sortOrder: 0 },
        { type: 'github', icon: 'github', value: 'https://github.com/Jasurbek0424', sortOrder: 1 },
        { type: 'linkedin', icon: 'linkedin', value: 'https://linkedin.com/in/khakimbekov', sortOrder: 2 },
        { type: 'instagram', icon: 'instagram', value: 'https://www.instagram.com/jasurbek_xakimbekov/', sortOrder: 3 },
        { type: 'telegram', icon: 'send', value: 'https://t.me/JasurbekXakimbekov', sortOrder: 4 },
      ],
    });
    console.log('✅ Contacts seeded');
  } else {
    console.log('ℹ️ Contacts already exist');
  }

  // Seed skill categories and skills (only if none exist)
  const existingCategories = await prisma.skillCategory.count();
  if (existingCategories === 0) {
    await prisma.skillCategory.create({
      data: {
        titleEn: 'Frontend',
        titleRu: 'Фронтенд',
        titleUz: 'Frontend',
        sortOrder: 0,
        skills: {
          create: [
            { label: 'HTML', sortOrder: 0 },
            { label: 'CSS', sortOrder: 1 },
            { label: 'JavaScript (ES6+)', sortOrder: 2 },
            { label: 'React', sortOrder: 3 },
            { label: 'Next.js', sortOrder: 4 },
            { label: 'Redux', sortOrder: 5 },
            { label: 'TypeScript', sortOrder: 6 },
            { label: 'Zustand', sortOrder: 7 },
          ],
        },
      },
    });
    await prisma.skillCategory.create({
      data: {
        titleEn: 'UI Libraries',
        titleRu: 'UI Библиотеки',
        titleUz: 'UI kutubxonalari',
        sortOrder: 1,
        skills: {
          create: [
            { label: 'MUI', sortOrder: 0 },
            { label: 'DaisyUI', sortOrder: 1 },
            { label: 'Tailwind CSS', sortOrder: 2 },
          ],
        },
      },
    });
    await prisma.skillCategory.create({
      data: {
        titleEn: 'Tools',
        titleRu: 'Инструменты',
        titleUz: 'Vositalar',
        sortOrder: 2,
        skills: {
          create: [
            { label: 'Node.js', sortOrder: 0 },
            { label: 'Python', sortOrder: 1 },
            { label: 'REST APIs', sortOrder: 2 },
            { label: 'Git', sortOrder: 3 },
            { label: 'Burp Suite', sortOrder: 4 },
            { label: 'AI Integration', sortOrder: 5 },
          ],
        },
      },
    });
    await prisma.skillCategory.create({
      data: {
        titleEn: 'Practices',
        titleRu: 'Практики',
        titleUz: 'Amaliyotlar',
        sortOrder: 3,
        skills: {
          create: [
            { label: 'Clean Architecture', sortOrder: 0 },
            { label: 'Component-based Design', sortOrder: 1 },
            { label: 'Performance Optimization', sortOrder: 2 },
          ],
        },
      },
    });
    console.log('✅ Skill categories and skills seeded');
  } else {
    console.log('ℹ️ Skill categories already exist');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
