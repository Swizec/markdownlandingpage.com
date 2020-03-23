import ApolloClient from "apollo-boost"
import fetch from "isomorphic-fetch"

const SERVER_URI = process.env.MDL_GRAPHQL_URL

export const client = new ApolloClient({
  uri: SERVER_URI,
  fetch,
})
