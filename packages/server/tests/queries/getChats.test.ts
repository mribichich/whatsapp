import { ApolloServer, gql } from 'apollo-server-express';
import { createTestClient } from 'apollo-server-testing';
import { users } from '../../src/db';
import schema from '../../src/schema';

describe('Query.chats', () => {
  it('should fetch all chats', async () => {
    const server = new ApolloServer({
      schema,
      context: () => ({
        currentUser: users[0],
      }),
    });

    const { query } = createTestClient(server as any);

    const res = await query({
      query: gql`
        query GetChats {
          chats {
            id
            name
            picture
            lastMessage {
              id
              content
              createdAt
            }
          }
        }
      `,
    });

    expect(res.data).toBeDefined();
    expect(res.errors).toBeUndefined();
    expect(res.data).toMatchSnapshot();
  });
});
