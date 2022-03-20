import gql from "graphql-tag"
import { useMutation } from "@apollo/client"
import { useEffect, useState } from "react"
import Choices, { QuestionQuery } from "./choices"

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

const CreateQuestionMutation = gql`
  mutation CreateQuestion($title: String!, $quizId: String!) {
    createQuestion(title: $title, quizId: $quizId) {
      id
      title
    }
  }
`

const UpdateQuestionMutation = gql`
  mutation UpdateQuestion($questionId: String!, $points: String!) {
    updateQuestion(questionId: $questionId, points: $points) {
      id
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
  const [points, setPoints] = useState({})
  const [refreshQuestionId, setRefreshQuestionId] = useState(-1)
  const [deletingQuestionId, setDeletingQuestionId] = useState(null)

  const [createQuestion, { loading }] = useMutation(CreateQuestionMutation, {
    refetchQueries: [
      {
        query: QuizQuery,
        variables: { quizId: `${quizId}` },
      },
    ],
  })

  const [updateQuestion, { loading: loadingUpdate }] = useMutation(
    UpdateQuestionMutation,
    {
      refetchQueries: [
        {
          query: QuestionQuery,
          variables: { questionId: `${refreshQuestionId}` },
        },
      ],
    }
  )

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
      <h2>Questions</h2>
      {loading ? (
        <h4>Saving...</h4>
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
      {questions &&
        questions.length > 0 &&
        questions.map(question => {
          return loadingDelete && question.id === deletingQuestionId ? (
            <h4 key={question.id}>Deleting...</h4>
          ) : (
            <div key={question.id} className="question">
              <h4>{question.title}</h4>
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
              <h4 key={question.id}>{question.points} points</h4>
              <input
                className="points"
                autoFocus
                onChange={e => {
                  setRefreshQuestionId(question.id)
                  return setPoints({
                    ...points,
                    [question.id]: e.target.value,
                  })
                }}
                onKeyDown={async e => {
                  if (e.key === "Enter") {
                    await updateQuestion({
                      variables: {
                        questionId: `${question.id}`,
                        points: points[question.id],
                      },
                    })
                  }
                }}
                placeholder={
                  points[question.id] === undefined
                    ? question.points
                    : points[question.id]
                }
                type="text"
                value={points[question.id]}
              />
              <Choices questionId={question.id} choices={question.choices} />
            </div>
          )
        })}
      <style jsx>{`
        div.question {
          display: block;
          margin-top: 2rem;
          margin-bottom: 2rem;
          padding-top: 1rem;
          background-color: #b1c6e4;
        }
        input.points {
          margin-left: 1rem;
          width: 4rem;
        }
        h2 {
          display: block;
        }
        h4 {
          display: inline;
          padding-left: 1rem;
          padding-right: 1rem;
        }
        button {
          display: inline;
        }
      `}</style>
    </>
  )
}

export default Questions
