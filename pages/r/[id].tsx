import Layout from "../../components/Layout"
import { useRouter } from "next/router"
import gql from "graphql-tag"
import { useQuery } from "@apollo/client"
import { useState } from "react"

const QuizQuery = gql`
  query quizQuery($quizId: String!) {
    quiz(quizId: $quizId) {
      id
      title
      secret
      published
      author {
        id
        name
      }
      questions {
        id
        title
        points
        choices {
          id
          name
          correct
        }
      }
    }
  }
`

function Post() {
  const [secret, setSecret] = useState("")
  const quizId = useRouter().query.id
  const { loading, error, data } = useQuery(QuizQuery, {
    variables: { quizId },
  })

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
      </div>
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

export default Post
