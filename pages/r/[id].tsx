import Layout from "../../components/Layout"
import Router, { useRouter } from "next/router"
import gql from "graphql-tag"
import { useMutation, useQuery } from "@apollo/client"
import { useState } from "react"

const QuizQuery = gql`
  query quizQuery($quizId: String!) {
    quiz(quizId: $quizId) {
      id
      title
      published
      author {
        id
        name
      }
    }
  }
`

const createResponseMutation = gql`
  mutation createResponseMutation(
    $quizId: String!
    $secret: String!
    $userEmail: String!
  ) {
    createResponse(quizId: $quizId, secret: $secret, userEmail: $userEmail) {
      id
    }
  }
`

function Response() {
  const [secret, setSecret] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const quizId = useRouter().query.id
  const { loading, error, data } = useQuery(QuizQuery, {
    variables: { quizId },
  })

  const [createResponse] = useMutation(createResponseMutation)

  if (loading) {
    return <div>Loading ...</div>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }

  let title = data.quiz.title
  if (!data.quiz.published) {
    title = `${title} (Draft)`
  }

  const authorName = data.quiz.author ? data.quiz.author.name : "Unknown author"
  return (
    <Layout>
      <div>
        <h2>{title}</h2>
        <p>By {authorName}</p>
        <input
          autoFocus
          onChange={e => setUserEmail(e.target.value)}
          placeholder="Email"
          type="text"
          value={userEmail}
        />
        <input
          autoFocus
          onChange={e => setSecret(e.target.value)}
          placeholder="Secret"
          type="text"
          value={secret}
        />
        <button
          onClick={async e => {
            const { data } = await createResponse({
              variables: {
                quizId: `${quizId}`,
                secret,
                userEmail,
              },
            })
            const responseId = data.createResponse.id
            Router.push(`/response/${responseId}`)
          }}
        >
          Play
        </button>
      </div>
      <style jsx>{`
        input {
          display: block;
          margin: 0 1rem 1rem 1rem;
        }
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
