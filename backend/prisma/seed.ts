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

  // Seed skill categories and skills — sync to CV (resets to PDF source of truth)
  await prisma.skill.deleteMany({});
  await prisma.skillCategory.deleteMany({});

  const skillData = [
    {
      titleEn: 'Frontend',
      titleRu: 'Фронтенд',
      titleUz: 'Frontend',
      sortOrder: 0,
      skills: ['HTML5', 'CSS3', 'JavaScript', 'TypeScript', 'React', 'Next.js', 'WebView'],
    },
    {
      titleEn: 'State & Data',
      titleRu: 'Состояние и данные',
      titleUz: 'Holat va data',
      sortOrder: 1,
      skills: ['Redux Toolkit', 'MobX', 'Zustand', 'React Query', 'TanStack Query', 'Axios'],
    },
    {
      titleEn: 'UI Libraries',
      titleRu: 'UI библиотеки',
      titleUz: 'UI kutubxonalari',
      sortOrder: 2,
      skills: ['MUI', 'Ant Design', 'Leaflet'],
    },
    {
      titleEn: 'Backend',
      titleRu: 'Бэкенд',
      titleUz: 'Backend',
      sortOrder: 3,
      skills: ['Python', 'Django Framework', 'Node.js', 'REST API'],
    },
    {
      titleEn: 'Tools & Other',
      titleRu: 'Инструменты и прочее',
      titleUz: 'Vositalar va boshqalar',
      sortOrder: 4,
      skills: ['Git', 'Jira', 'i18next', 'Lodash', 'API Testing', 'Burp Suite', 'AI Integration', 'Analytical Thinking'],
    },
  ];

  for (const cat of skillData) {
    await prisma.skillCategory.create({
      data: {
        titleEn: cat.titleEn,
        titleRu: cat.titleRu,
        titleUz: cat.titleUz,
        sortOrder: cat.sortOrder,
        skills: {
          create: cat.skills.map((label, i) => ({ label, sortOrder: i })),
        },
      },
    });
  }
  console.log('✅ Skill categories and skills synced');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
