import React, { useState, useEffect } from "react"
import { useAuth } from "react-use-auth"
import { Box, Button, Heading } from "rebass"
import { Input } from "@rebass/forms"
import { useMutation, useQuery } from "react-apollo-hooks"
import gql from "graphql-tag"
import { Link, useStaticQuery, graphql } from "gatsby"

const CreatePage = ({ userId }) => {
  const [pageName, setPageName] = useState()
  const [createPage, { data, loading }] = useMutation(
    gql`
      mutation createPage($userId: String, $pageName: String) {
        createPage(userId: $userId, pageName: $pageName) {
          pageId
        }
      }
    `,
    {
      variables: {
        pageName,
        userId,
      },
    }
  )

  return (
    <Box>
      <Input
        name="pageName"
        placeholder="Name your page"
        value={pageName}
        onChange={ev => setPageName(ev.target.value)}
      />
      {!data ? (
        <Button variant="primary" onClick={createPage} disabled={loading}>
          Create new page
        </Button>
      ) : null}
      {data ? (
        <Link to={`/${data.createPage.pageId}`}>
          start writing your landing page
        </Link>
      ) : null}
    </Box>
  )
}

function useAllPages({ userId }) {
  let data = useStaticQuery(graphql`
    query {
      mdlapi {
        allPages {
          userId
          pageId
          createdAt
          pageName
        }
      }
    }
  `)

  // TODO: this is insecure, we should filter on the server
  const [pageList, setPageList] = useState(
    data.mdlapi.allPages.filter(page => page.userId === userId)
  )

  const liveQuery = useQuery(gql`
    query {
      allPages {
        userId
        pageId
        createdAt
        pageName
      }
    }
  `)

  useEffect(() => {
    // if data loaded successfully
    if (liveQuery.data) {
      setPageList(
        liveQuery.data.allPages.filter(page => page.userId === userId)
      )
    }
  }, [liveQuery.data])

  return pageList
}

// assuming this is only rendered when isAuthenticated() === true
// so we don't have to check here
export const Dashboard = () => {
  const { user, userId } = useAuth()
  const pageList = useAllPages({ userId })

  return (
    <Box m={[2, 3, 4]}>
      <p>
        Hello <strong> {user.nickname} </strong>, what are you going to create
        today?
      </p>
      <CreatePage userId={userId} />
      <br />
      <Heading>Edit your existing pages</Heading>
      {pageList.map(page => (
        <Box>
          <Link to={`/${page.pageId}`}>
            {page.pageName} - {new Date(page.createdAt).toDateString()}
          </Link>
        </Box>
      ))}
    </Box>
  )
}
