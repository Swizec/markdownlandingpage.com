import React from "react"
// import { useStaticQuery, graphql, Link } from "gatsby"

import Layout from "../components/layout"
// import Image from "../components/image"
import SEO from "../components/seo"
import { useAuth } from "react-use-auth"
import { Heading } from "rebass"

const LandingPage = ({ pageContext }) => {
  const { isAuthenticated, user, login } = useAuth()

  console.log(pageContext)

  return (
    <Layout>
      <SEO title="Markdown Landing Page" />
      <Heading fontSize={[5, 6, 7]}>Markdown Landing Page</Heading>
      <p>Write a landing page for anything</p>
    </Layout>
  )
}

export default LandingPage
