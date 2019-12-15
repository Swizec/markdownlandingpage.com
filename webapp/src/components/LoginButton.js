import React, { useEffect } from "react"
import { useAuth } from "react-use-auth"
import { useMutation } from "react-apollo-hooks"
import gql from "graphql-tag"
import { Button } from "rebass"

function useUpdateUser(userId) {
  const [updateUser] = useMutation(
    gql`
      mutation updateUser($userId: String) {
        updateUser(userId: $userId) {
          userId
        }
      }
    `,
    {
      variables: {
        userId,
      },
    }
  )

  // runs when userId updates
  useEffect(() => {
    updateUser()
  }, [userId])
}

export const LoginButton = () => {
  const { isAuthenticated, userId, login, logout } = useAuth()
  useUpdateUser(userId)

  return isAuthenticated() ? (
    <Button bg="muted" onClick={logout}>
      Logout
    </Button>
  ) : (
    <Button bg="highlight" color="text" onClick={login}>
      Get started
    </Button>
  )
}
