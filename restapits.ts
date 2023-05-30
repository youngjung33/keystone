const express = require('express');
const { config, list } = require('@keystone-6/core');
const { text } = require('@keystone-6/core/fields');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();
const {allowAll} = require('@keystone-6/core/access')


const databaseUrl = process.env.DATABASE_URL || '';

const keystone = config({
  db: {
    provider: 'sqlite',
    url: databaseUrl,
  },
  lists: {
    User: list({
        access: {
            operation:{
            query: allowAll,
            create: allowAll,
            update: allowAll,
            delete: allowAll,
            }
        },
    }),
  },
});

const app = express();

app.use(express.json());

app.get('/users', async (req, res) => {
  const context = {
    db: {
      User: keystone.lists.User,
    },
    prisma: new PrismaClient(),
  };

  try {
    await context.prisma.$connect();
    const users = await context.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        company: true,
      },
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await context.prisma.$disconnect();
  }
});

app.listen(3000, () => {
  console.log('Express 앱이 3000번 포트에서 실행 중입니다.');
});
