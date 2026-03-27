import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import { CATEGORY_CONFIGS, ARTICLE_TEMPLATES, TEST_USER } from "./seed-data";

const prisma = new PrismaClient();

async function main() {
  // Catégories — upsert idempotent
  const categories = await Promise.all(
    CATEGORY_CONFIGS.map((cfg) =>
      prisma.category.upsert({
        where:  { slug: cfg.slug },
        update: { description: cfg.description, order: cfg.order },
        create: cfg,
      })
    )
  );

  // Index slug → id pour le mapping des articles
  const categoryIdBySlug = Object.fromEntries(
    categories.map((c) => [c.slug, c.id])
  );

  // Articles — upsert idempotent
  for (const tpl of ARTICLE_TEMPLATES) {
    const { categorySlug, ...rest } = tpl;
    await prisma.article.upsert({
      where:  { slug: tpl.slug },
      update: {
        title:    rest.title,
        excerpt:  rest.excerpt,
        content:  rest.content,
        imageUrl: rest.imageUrl,
        imageAlt: rest.imageAlt,
        author:   rest.author,
        tags:     rest.tags,
      },
      create: { ...rest, categoryId: categoryIdBySlug[categorySlug] },
    });
  }

  // Utilisateur de test — upsert idempotent
  const passwordHash = await hash(TEST_USER.password, 12);
  await prisma.user.upsert({
    where:  { email: TEST_USER.email },
    update: {},
    create: {
      name:         TEST_USER.name,
      email:        TEST_USER.email,
      passwordHash,
    },
  });

  console.log(
    `Seed terminé : ${CATEGORY_CONFIGS.length} catégories, ` +
    `${ARTICLE_TEMPLATES.length} articles, 1 utilisateur test`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
