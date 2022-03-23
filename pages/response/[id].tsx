import Layout from "../../components/Layout"
import Router, { useRouter } from "next/router"
import gql from "graphql-tag"
import { useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import Questions from "./questions"

const ResponseQuery = gql`
  query responseQuery($responseId: String!) {
    response(responseId: $responseId) {
      id
      quiz {
        id
        title
        questions {
          points
          title
          id
          choices {
            name
            id
          }
        }
      }
    }
  }
`

function Response() {
  const responseId = useRouter().query.id
  const { loading, error, data } = useQuery(ResponseQuery, {
    variables: { responseId },
  })

  if (loading) {
    return <div>Loading ...</div>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }

  const { quiz } = data.response

  return (
    <Layout>
      <h2>{quiz.title}</h2>
      <Questions
        responseId={responseId}
        quizId={quiz.id}
        questions={quiz.questions}
      />
      <style jsx>{`
        .buttonLayout {
          display: block;
        }
        span.secret {
          display: inline;
          margin-right: 0.25rem;
        }
        h4.secret {
          display: inline;
          margin-right: 0.25rem;
        }
        .page {
          background: white;
          padding: 2rem;
        }

        .actions {
          margin-top: 2rem;
        }

        button {
          background: #ececec;
          border: 0;
          border-radius: 0.125rem;
          padding: 1rem 2rem;
        }

        button + button {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  )
}

export default Response
