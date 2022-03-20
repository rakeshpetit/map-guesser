import Layout from "../../components/Layout"
import Router, { useRouter } from "next/router"
import gql from "graphql-tag"
import { useQuery, useMutation } from "@apollo/client"
import Questions from "./questions"
import { QuizesQuery } from ".."
import { DraftsQuery } from "../drafts"
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

const PublishQuizMutation = gql`
  mutation PublishQuiz($quizId: String!) {
    publishQuiz(quizId: $quizId) {
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

const UpdateQuizMutation = gql`
  mutation UpdateQuizMutation($quizId: String!, $secret: String) {
    updateQuiz(quizId: $quizId, secret: $secret) {
      id
      secret
    }
  }
`

const DeleteQuizMutation = gql`
  mutation DeleteQuizMutation($quizId: String!) {
    deleteQuiz(quizId: $quizId) {
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

function Post() {
  const [secret, setSecret] = useState("")
  const quizId = useRouter().query.id
  const { loading, error, data } = useQuery(QuizQuery, {
    variables: { quizId },
  })

  const [publish] = useMutation(PublishQuizMutation, {
    refetchQueries: [
      {
        query: QuizesQuery,
      },
      {
        query: DraftsQuery,
      },
    ],
  })
  const [deleteQuiz] = useMutation(DeleteQuizMutation, {
    refetchQueries: [
      {
        query: QuizesQuery,
      },
      {
        query: DraftsQuery,
      },
    ],
  })

  const [updateQuiz] = useMutation(UpdateQuizMutation, {
    refetchQueries: [
      {
        query: DraftsQuery,
      },
    ],
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
        <span className="secret">Secret:</span>
        <h4 className="secret">{data.quiz.secret}</h4>
        <input
          autoFocus
          onChange={e => setSecret(e.target.value)}
          onKeyDown={async e => {
            if (e.key === "Enter") {
              await updateQuiz({
                variables: {
                  quizId: `${quizId}`,
                  secret,
                },
              })
              setSecret("")
            }
          }}
          placeholder="Modify secret"
          type="text"
          value={secret}
        />
        <div className="buttonLayout">
          {!data.quiz.published && (
            <button
              onClick={async e => {
                await publish({
                  variables: {
                    quizId,
                  },
                })
                Router.push("/")
              }}
            >
              Publish
            </button>
          )}
          <button
            onClick={async e => {
              await deleteQuiz({
                variables: {
                  quizId,
                },
              })
              Router.push("/")
            }}
          >
            Delete
          </button>
        </div>

        {!data.quiz.published && (
          <Questions quizId={data.quiz.id} questions={data.quiz.questions} />
        )}
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
