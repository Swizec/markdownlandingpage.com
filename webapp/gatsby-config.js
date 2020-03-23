const activeEnv =
  process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development"

const config = require(`./config.${activeEnv}.json`)

module.exports = {
  siteMetadata: {
    title: `Markdown Landing Page`,
    description: `Write a landing page for anything.`,
    author: `@swizec`,
    mdlConfig: {
      mdl_graphql_url: config.MDL_GRAPHQL_URL,
      create_stripe_session_url: config.CREATE_STRIPE_SESSION_URL,
      stripe_key: config.STRIPE_KEY,
    },
  },
  plugins: [
    "gatsby-plugin-theme-ui",
    {
      resolve: "gatsby-source-graphql",
      options: {
        typeName: "MDLAPI",
        fieldName: "mdlapi",
        url: config.MDL_GRAPHQL_URL,
      },
    },
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    // `gatsby-plugin-offline`,
  ],
}
