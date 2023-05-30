const express = require('express');
const { config, list } = require('@keystone-6/core');
const { text } = require('@keystone-6/core/fields');
const { PrismaClient } = require('@prisma/client');
const {allowAll} = require('@keystone-6/core/access')
require('dotenv').config();

const databaseUrl = process.env.DATABASE_URL;

const keystone = config({
    db: {
      provider: 'sqlite',
      url: databaseUrl,
      port:process.env.PORT || 80,
  },
  lists:{
    User:list({
        access: {
            operation:{
            query: allowAll,
            create: allowAll,
            update: allowAll,
            delete: allowAll,
            }
        },
    })
  }
})

const app = express();

app.use(express.json());


app.get('/users', async (req, res) => {
    const context = {
      db: {
        User: keystone.lists.User,
      },
      prisma : new PrismaClient(),
    };
  
    try {
      await context.prisma.$connect();
      const users = await context.prisma.user.findMany({
        select:{
          id :true,
          name:true,
          company:true
        },
      })
  
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  const server = app.listen(process.env.PORT || 80, () => {
    const address = server.address();
    console.log(`Express 앱이 ${address.address}:${address.port}에서 실행 중입니다.`);
  });
// app.listen(8080, () => {
//   console.log('Express 앱이 8080번 포트에서 실행 중입니다.');
// });
