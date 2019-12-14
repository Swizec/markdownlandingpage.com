import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

import Layout from "../components/layout"
import Image from "../components/image"
import SEO from "../components/seo"

import { Heading, Button } from 'rebass'
import { useAuth } from 'react-use-auth'

const IndexPage = () => {
    const { isAuthenticated, user, login } = useAuth()
    const data = useStaticQuery(graphql`
        query {
            mdlapi {
                hello {
                    world
                }
            }
        }
    `)

  return (
    <Layout>
        <SEO title="Markdown Landing Page" />
        <Heading fontSize={[5, 6, 7]}>Markdown Landing Page</Heading>
        <p>write a landing page for anything</p>
        <p>From GraphQL server: {data.mdlapi.hello.world}</p>
        {isAuthenticated() ? <p>hello {user.nickname}</p> : null}
        <Button bg='highlight' onClick={login}>Get started</Button>
    </Layout>
  )
}

export default IndexPage
