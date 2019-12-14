  
import { ApolloServer, gql } from "apollo-server-lambda"

// this is where we define the shape of our API
const schema = gql`
    type Hello {
        world: String
    }

    type Query {
        hello: Hello
    }
`

// this is where the shape maps to functions
const resolvers = {
    Query: {
        hello: () => ({
            world: "Hello world"
        })
    }
}

const server = new ApolloServer({ typeDefs: schema, resolvers })

export const handler = server.createHandler({
    cors: {
        origin: '*', // for security in production, lock this to your real endpoints
        credentials: true
    }
})