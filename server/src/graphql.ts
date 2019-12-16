import { ApolloServer, gql } from "apollo-server-lambda";

import { updateUser, createPage } from "./mutations";
import { allPages } from "./queries";

// this is where we define the shape of our API
const schema = gql`
    type User {
        userId: String
        createdAt: String
        lastSignedInAt: String
    }

    type LandingPage {
        userId: String
        pageId: String
        createdAt: String
        pageName: String
        content: String
    }

    type Query {
        allPages: [LandingPage]
    }

    type Mutation {
        updateUser(userId: String): User
        createPage(userId: String, pageName: String): LandingPage
    }
`;

// this is where the shape maps to functions
const resolvers = {
    Query: {
        allPages
    },
    Mutation: {
        updateUser,
        createPage
    }
};

const server = new ApolloServer({ typeDefs: schema, resolvers });

export const handler = server.createHandler({
    cors: {
        origin: "*", // for security in production, lock this to your real endpoints
        credentials: true
    }
});
