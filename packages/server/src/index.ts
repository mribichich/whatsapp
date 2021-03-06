import { ApolloServer, PubSub } from 'apollo-server-express';
import cookie from 'cookie';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import { users } from './db';
import schema from './schema';

const app = express();

const origin = process.env.ORIGIN || 'http://localhost:3000';
app.use(cors({ credentials: true, origin }));
app.use(express.json());
app.use(cookieParser());

app.get('/_ping', (req, res) => {
  res.send('pong');
});

const pubsub = new PubSub();

const server = new ApolloServer({
  schema,
  context: (session: any) => {
    // Access the request object
    let req = session.connection
      ? session.connection.context.request
      : session.req;

    // It's subscription
    if (session.connection) {
      req.cookies = cookie.parse(session.payload.cookies || '');
    } else {
      req.cookies = {
        ...req.cookies,
        ...(req.headers.cookies ? cookie.parse(req.headers.cookies) : {}),
      };
    }

    return {
      currentUser: users.find((u) => u.id === req.cookies.currentUserId),
      pubsub,
    };
  },
  subscriptions: {
    onConnect(params, ws, ctx) {
      // pass the request object to context
      return {
        request: ctx.request,
      };
    },
    keepAlive: 5000,
  },
  playground: true,
  introspection: true,
});

server.applyMiddleware({
  app,
  path: '/graphql',
  cors: { credentials: true, origin },
});

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const port = process.env.PORT || 4000;

httpServer.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
