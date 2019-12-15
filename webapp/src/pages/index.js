import React, { useEffect } from "react"
// import { useStaticQuery, graphql, Link } from "gatsby"

import Layout from "../components/layout"
// import Image from "../components/image"
import SEO from "../components/seo"

import { Heading, Button } from "rebass"
import { useAuth } from "react-use-auth"
import { useMutation } from "react-apollo-hooks"
import gql from "graphql-tag"

const LoginButton = () => {
  const { isAuthenticated, user, userId, login, logout } = useAuth()

  const [updateUser, { data }] = useMutation(
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

  console.log(data)

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

const IndexPage = () => {
  const { isAuthenticated, user, login } = useAuth()

  return (
    <Layout>
      <SEO title="Markdown Landing Page" />
      <Heading fontSize={[5, 6, 7]}>Markdown Landing Page</Heading>
      <p>write a landing page for anything</p>
      {isAuthenticated() ? <p>hello {user.nickname}</p> : null}

      <LoginButton />
    </Layout>
  )
}

export default IndexPage
