import ApolloClient from "apollo-boost"
import fetch from "isomorphic-fetch"

const activeEnv =
  process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development"

const config = require(`../config.${activeEnv}.json`)

export const client = new ApolloClient({
  uri: config.MDL_GRAPHQL_URL,
  fetch,
})
