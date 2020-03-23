import React, { useState, useEffect } from "react"

import Layout from "../components/layout"
// import Image from "../components/image"
import SEO from "../components/seo"
import { useAuth } from "react-use-auth"
import { Heading, Flex, Box, Button, Text } from "rebass"
import { Textarea } from "@rebass/forms"
import { useQuery, useMutation } from "react-apollo-hooks"
import gql from "graphql-tag"
import { useStaticQuery } from "gatsby"

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

function usePurchaseParams() {
  if (typeof window !== "undefined") {
    const query = new URLSearchParams(window.location.search)

    if (query.get("session_id")) {
      // TODO: check against server
      return true
    }
  }

  return false
}

const PurchaseSuccess = ({ pageId }) => {
  return (
    <Box mt={0} mb={20}>
      <Heading sx={{ textAlign: "center" }}>
        Thank you for your purchase. Your page is live at
        http://markdownlandingpage.com/{pageId}
      </Heading>
    </Box>
  )
}

const LandingPage = ({ pageContext }) => {
  const { pageName, pageId, userId } = pageContext
  const { isAuthenticated, user } = useAuth()

  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            mdlConfig {
              create_stripe_session_url
              stripe_key
            }
          }
        }
      }
    `
  )

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
      `${
        site.siteMetadata.mdlConfig.create_stripe_session_url
      }${encodeURIComponent(userId)}/${encodeURIComponent(
        pageId
      )}?callback_domain=${window.location.protocol}//${
        window.location.hostname
      }`
    ).then(res => res.json())

    const stripe = window.Stripe(site.siteMetadata.mdlConfig.stripe_key)
    stripe
      .redirectToCheckout({
        sessionId: stripeSession.id,
      })
      .then(console.log)
  }

  const renderedPage = useRemark(pageContent)
  const shouldBeEditable = isAuthenticated() && user.sub === userId

  const returnedFromPurchase = usePurchaseParams()

  return (
    <Layout>
      <SEO title={pageName} />
      {returnedFromPurchase ? <PurchaseSuccess pageId={pageId} /> : null}

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
