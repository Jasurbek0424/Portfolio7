import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

async function main() {
  await prisma.skill.deleteMany({});
  await prisma.skillCategory.deleteMany({});
  console.log('🗑️  Old skill data cleared');

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
    console.log(`✅ ${cat.titleEn} (${cat.skills.length} skills)`);
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
