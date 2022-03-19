import gql from "graphql-tag"
import { useMutation } from "@apollo/client"
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
  const [deletingQuestionId, setDeletingQuestionId] = useState(null)

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
        return loadingDelete && question.id === deletingQuestionId ? (
          <h4 key={question.id}>Deleting...</h4>
        ) : (
          <>
            <h4 key={question.id}>{question.title}</h4>
            <button
              onClick={async e => {
                setDeletingQuestionId(question.id)
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

export default Questions
