import React from "react"
// import { useStaticQuery, graphql, Link } from "gatsby"

import Layout from "../components/layout"
// import Image from "../components/image"
import SEO from "../components/seo"
import { useAuth } from "react-use-auth"
import { Heading } from "rebass"
import { useQuery } from "react-apollo-hooks"
import gql from "graphql-tag"

const LandingPage = ({ pageContext }) => {
  const { pageName, pageId, userId } = pageContext
  //   const { isAuthenticated, user, login } = useAuth()

  const { loading, data } = useQuery(
    gql`
      query page($userId: String, $pageId: String) {
        page(userId: $userId, pageId: $pageId) {
          content
          createdAt
          lastUpdatedAt
        }
      }
    `,
    { variables: { userId, pageId } }
  )

  const content = data ? data.page.content : pageContext.content

  return (
    <Layout>
      <SEO title={pageName} />
      <Heading fontSize={[5, 6, 7]}>{pageName}</Heading>
      {content}
    </Layout>
  )
}

export default LandingPage
