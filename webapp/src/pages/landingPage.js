import React, { useState, useEffect } from "react"

import Layout from "../components/layout"
// import Image from "../components/image"
import SEO from "../components/seo"
import { useAuth } from "react-use-auth"
import { Heading, Flex, Box, Button, Text } from "rebass"
import { Textarea } from "@rebass/forms"
import { useQuery, useMutation } from "react-apollo-hooks"
import gql from "graphql-tag"

import useRemark from "../useRemark"

function useContentFromServer({ userId, pageId, pageContent, setPageContent }) {
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

  // TODO: handle errors
  const [savePage] = useMutation(
    gql`
      mutation savePage($userId: String, $pageId: String, $content: String) {
        savePage(userId: $userId, pageId: $pageId, content: $content) {
          content
          lastUpdatedAt
        }
      }
    `,
    {
      variables: {
        userId,
        pageId,
        content: pageContent,
      },
    }
  )

  useEffect(() => {
    if (data) {
      setPageContent(data.page.content)
    }
  }, [data])

  return savePage
}

const LandingPage = ({ pageContext }) => {
  const { pageName, pageId, userId } = pageContext
  const { isAuthenticated, user } = useAuth()

  // initiate state with compile-time data
  const [pageContent, setPageContent] = useState(pageContext.content)
  // fetch fresh state from server on component mount
  const savePage = useContentFromServer({
    userId,
    pageId,
    pageContent,
    setPageContent,
  })

  const deployPage = async () => {
    // trigger stripe checkout
    // run mutation on server to mark page as "deployed"
    // tell user how to go there (popup or something)

    const stripeSession = await fetch(
      // TODO: use a config for this before going live
      `https://cbvo4h8dge.execute-api.us-east-1.amazonaws.com/dev/createstripesession/${encodeURIComponent(
        userId
      )}/${encodeURIComponent(pageId)}?callback_domain=${
        window.location.protocol
      }//${window.location.hostname}`
    ).then(res => res.json())

    console.log(stripeSession)
  }

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
                height="80%"
              />
              <Button variant="primary" onClick={savePage}>
                Save
              </Button>
              <Button bg="highlight" ml={2} onClick={deployPage}>
                Deploy
              </Button>
              <Text fontSize={2}>
                Just share this URL with anyone, they only see the final page
              </Text>
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
