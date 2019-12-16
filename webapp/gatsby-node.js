/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
const path = require("path")

// creating Gatsby pages for every entry in our dataset
exports.createPages = async ({ graphql, actions }) => {
  // fetch landing pages
  const result = await graphql(`
    query {
      mdlapi {
        allPages {
          pageId
          pageName
          content
        }
      }
    }
  `)

  // iterate through result, create Gatsby pages
  result.data.mdlapi.allPages.forEach(({ pageId, pageName, content }) => {
    const landingPagePath = path.resolve("./src/pages/landingPage.js")

    // creates single page at url
    actions.createPage({
      path: `/${pageId}`,
      component: landingPagePath,
      context: {
        pageId,
        pageName,
        content,
      },
    })
  })

  return true
}
