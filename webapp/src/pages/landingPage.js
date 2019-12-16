import React, { useState, useEffect } from "react"

import Layout from "../components/layout"
// import Image from "../components/image"
import SEO from "../components/seo"
import { useAuth } from "react-use-auth"
import { Heading, Flex, Box } from "rebass"
import { Textarea } from "@rebass/forms"
import { useQuery } from "react-apollo-hooks"
import gql from "graphql-tag"

import useRemark from "../useRemark"

function useContentFromServer({ userId, pageId, setPageContent }) {
  const { data } = useQuery(
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
  useEffect(() => {
    if (data) {
      setPageContent(data.page.content)
    }
  }, [data])
}

const LandingPage = ({ pageContext }) => {
  const { pageName, pageId, userId } = pageContext
  const { isAuthenticated, user } = useAuth()

  // initiate state with compile-time data
  const [pageContent, setPageContent] = useState(pageContext.content)
  // fetch fresh state from server on component mount
  useContentFromServer({ userId, pageId, setPageContent })

  const renderedPage = useRemark(pageContent)
  const shouldBeEditable = isAuthenticated() && user.sub === userId

  return (
    <Layout>
      <SEO title={pageName} />

      {shouldBeEditable ? (
        <>
          <Heading fontSize={[5, 6, 7]}>{pageName}</Heading>
          <Flex>
            <Box width={1 / 2}>
              <Textarea
                value={pageContent}
                onChange={ev => setPageContent(ev.target.value)}
              />
            </Box>
            <Box width={1 / 2}>{renderedPage}</Box>
          </Flex>
        </>
      ) : (
        <Flex>
          <Box width={1}>{renderedPage}</Box>
        </Flex>
      )}
    </Layout>
  )
}

export default LandingPage
