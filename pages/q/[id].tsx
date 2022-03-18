import Layout from "../../components/Layout"
import Router, { useRouter } from "next/router"
import gql from "graphql-tag"
import { useQuery, useMutation } from "@apollo/client"
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
      questions {
        id
        title
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

const CreateQuestionMutation = gql`
  mutation CreateQuestion($title: String!, $quizId: String!) {
    createQuestion(title: $title, quizId: $quizId) {
      id
      title
    }
  }
`

const DeleteQuestionMutation = gql`
  mutation DeleteQuestionMutation($questionId: String!) {
    deleteQuestion(questionId: $questionId) {
      id
      title
    }
  }
`

function Questions({ quizId, questions }) {
  const [title, setTitle] = useState("")

  const [createQuestion, { loading }] = useMutation(CreateQuestionMutation, {
    refetchQueries: [
      {
        query: QuizQuery,
        variables: { quizId: `${quizId}` },
      },
    ],
  })

  const [deleteQuestion, { loading: loadingDelete }] = useMutation(
    DeleteQuestionMutation,
    {
      refetchQueries: [
        {
          query: QuizQuery,
          variables: { quizId: `${quizId}` },
        },
      ],
    }
  )

  return (
    <>
      <h3>Questions</h3>
      {loading ? (
        <h4>"Saving..."</h4>
      ) : (
        <div>
          <input
            autoFocus
            onChange={e => setTitle(e.target.value)}
            onKeyDown={async e => {
              if (e.key === "Enter") {
                await createQuestion({
                  variables: {
                    title,
                    quizId: `${quizId}`,
                  },
                })
                setTitle("")
              }
            }}
            placeholder="Add question"
            type="text"
            value={title}
          />
        </div>
      )}
      {questions.map(question => {
        return loadingDelete ? (
          <h4 key={question.id}>Deleting...</h4>
        ) : (
          <>
            <h4 key={question.id}>{question.title}</h4>
            <button
              onClick={async e => {
                await deleteQuestion({
                  variables: {
                    questionId: `${question.id}`,
                  },
                })
              }}
            >
              Delete
            </button>
          </>
        )
      })}
    </>
  )
}

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
        {!data.quiz.published && (
          <Questions quizId={data.quiz.id} questions={data.quiz.questions} />
        )}
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
