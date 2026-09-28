require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const SLUG = 'joining-uzinfocom';

const post = {
  slug: SLUG,
  published: false,
  thumbnail: null,

  titleEn: 'A New Chapter: Joining UZINFOCOM as Senior Frontend Engineer',
  titleRu: 'Новая глава: Senior Frontend-инженер в UZINFOCOM',
  titleUz: "Yangi bosqich: UZINFOCOM'da Senior Frontend muhandis",

  descriptionEn:
    'I\'ve joined "Single integrator - UZINFOCOM" LLC as a Senior Frontend Engineer to help build national-scale digital services.',
  descriptionRu:
    'Я присоединился к ООО «Single integrator - UZINFOCOM» в роли Senior Frontend-инженера для разработки цифровых сервисов национального масштаба.',
  descriptionUz:
    "\"Single integrator - UZINFOCOM\" MChJ ga Senior Frontend muhandis sifatida qo'shildim — milliy miqyosdagi raqamli xizmatlarni yaratish uchun.",

  contentEn: [
    'Today marks a new chapter in my career: I\'ve joined "Single integrator - UZINFOCOM" LLC as a **Senior Frontend Engineer**. UZINFOCOM is one of Uzbekistan\'s leading state IT integrators, building digital services used by millions of citizens.',
    'This role is a big opportunity for me — designing the frontend architecture of large-scale platforms with React and TypeScript, working on performance and accessibility, and shipping products that have real impact in the public sector alongside a strong team.',
    'My previous experience — at Mars IT School, Uravo, and AIVA Group — prepared me for this step. The focus now is clear: reliable, maintainable, and user-friendly interfaces. I\'ll keep sharing what I learn along the way.',
  ].join('\n\n'),

  contentRu: [
    'Сегодня начинается новая глава в моей карьере: я присоединился к ООО «Single integrator - UZINFOCOM» в роли **Senior Frontend-инженера**. UZINFOCOM — один из ведущих государственных IT-интеграторов Узбекистана, создающий цифровые сервисы, которыми пользуются миллионы граждан.',
    'Эта роль — большая возможность для меня: проектировать фронтенд-архитектуру масштабных платформ на React и TypeScript, работать над производительностью и доступностью и вместе с сильной командой создавать продукты, которые оказывают реальное влияние в государственном секторе.',
    'Мой предыдущий опыт — в Mars IT School, Uravo и AIVA Group — подготовил меня к этому шагу. Теперь фокус ясен: надёжные, поддерживаемые и удобные интерфейсы. Буду делиться тем, что узнаю по пути.',
  ].join('\n\n'),

  contentUz: [
    "Bugun karyeramda yangi bosqich boshlandi: \"Single integrator - UZINFOCOM\" MChJ ga **Senior Frontend muhandis** sifatida qo'shildim. UZINFOCOM O'zbekistonning yetakchi davlat IT-integratorlaridan biri bo'lib, millionlab fuqaro foydalanadigan raqamli xizmatlarni ishlab chiqadi.",
    "Bu rol men uchun katta imkoniyat: React va TypeScript asosida yirik miqyosdagi platformalar arxitekturasini qurish, unumdorlik va accessibility ustida ishlash, hamda kuchli jamoa bilan birga davlat sektorida real ta'sir ko'rsatadigan mahsulotlar yaratish.",
    "Oldingi tajribalarim — Mars IT School, Uravo va AIVA Group — meni shu bosqichga tayyorladi. Endi e'tibor aniq: barqaror, qo'llab-quvvatlanadigan va foydalanuvchiga qulay interfeyslar. Yo'lda o'rganganlarim bilan o'rtoqlashib boraman.",
  ].join('\n\n'),
};

async function main() {
  const result = await prisma.blogPost.upsert({
    where: { slug: SLUG },
    update: post,
    create: post,
  });
  console.log(`OK: blog "${result.slug}" (published=${result.published}) id=${result.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
