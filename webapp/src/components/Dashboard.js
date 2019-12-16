import React, { useState } from "react"
import { useAuth } from "react-use-auth"
import { Box, Button } from "rebass"
import { Input } from "@rebass/forms"
import { useMutation } from "react-apollo-hooks"
import gql from "graphql-tag"

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
      <Button variant="primary" onClick={createPage} disabled={loading}>
        Create new page
      </Button>
    </Box>
  )
}

// assuming this is only rendered when isAuthenticated() === true
// so we don't have to check here
export const Dashboard = () => {
  const { user, userId } = useAuth()

  return (
    <Box m={[2, 3, 4]}>
      <p>
        Hello <strong> {user.nickname} </strong>, what are you going to create
        today?
      </p>
      <CreatePage userId={userId} />
      <br />
      List all pages here
    </Box>
  )
}
