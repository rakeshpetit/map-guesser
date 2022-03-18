import Layout from "../../components/Layout"
import Router, { useRouter } from "next/router"
import gql from "graphql-tag"
import { useQuery, useMutation } from "@apollo/client"

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
  const quizId = useRouter().query.id
  const { loading, error, data } = useQuery(QuizQuery, {
    variables: { quizId },
  })

  const [publish] = useMutation(PublishQuizMutation)
  const [deleteQuiz] = useMutation(DeleteQuizMutation)

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
      <style jsx>{`
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
