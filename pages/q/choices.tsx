import gql from "graphql-tag"
import { useMutation } from "@apollo/client"
import { useState } from "react"

export const QuestionQuery = gql`
  query Question($questionId: String!) {
    question(questionId: $questionId) {
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
`

const CreateChoiceMutation = gql`
  mutation CreateChoice($name: String!, $questionId: String!) {
    createChoice(name: $name, questionId: $questionId) {
      id
      name
    }
  }
`
const UpdateChoiceMutation = gql`
  mutation UpdateChoice($name: String, $correct: Boolean, $choiceId: String!) {
    updateChoice(name: $name, correct: $correct, choiceId: $choiceId) {
      id
    }
  }
`

const DeleteChoiceMutation = gql`
  mutation DeleteChoice($choiceId: String!) {
    deleteChoice(choiceId: $choiceId) {
      id
      name
    }
  }
`

function Choices({ questionId, choices }) {
  const [name, setName] = useState("")
  const [deletingChoiceId, setDeletingChoiceId] = useState(null)

  const [createChoice, { loading }] = useMutation(CreateChoiceMutation, {
    refetchQueries: [
      {
        query: QuestionQuery,
        variables: { questionId: `${questionId}` },
      },
    ],
  })

  const [updateChoice, { loading: loadingUpdate }] = useMutation(
    UpdateChoiceMutation,
    {
      refetchQueries: [
        {
          query: QuestionQuery,
          variables: { questionId: `${questionId}` },
        },
      ],
    }
  )

  const [deleteChoice, { loading: loadingDelete }] = useMutation(
    DeleteChoiceMutation,
    {
      refetchQueries: [
        {
          query: QuestionQuery,
          variables: { questionId: `${questionId}` },
        },
      ],
    }
  )

  return (
    <div className="allChoices">
      {choices &&
        choices.length > 0 &&
        choices.map(choice => {
          return loadingDelete && choice.id === deletingChoiceId ? (
            <h4 key={choice.id}>Deleting...</h4>
          ) : (
            <div key={choice.id} className="deleteChoice">
              <input
                type="radio"
                name={questionId}
                value={choice.id}
                onChange={async e => {
                  console.log("e", e.target.value)
                  await updateChoice({
                    variables: {
                      choiceId: `${e.target.value}`,
                      correct: true,
                    },
                  })
                }}
                checked={choice.correct}
              ></input>
              <label htmlFor={choice.id} />
              <h4>{choice.name}</h4>
              <button
                onClick={async e => {
                  setDeletingChoiceId(choice.id)
                  await deleteChoice({
                    variables: {
                      choiceId: `${choice.id}`,
                    },
                  })
                }}
              >
                Delete
              </button>
            </div>
          )
        })}
      {loading ? (
        <h4>Saving...</h4>
      ) : (
        <div className="addButton">
          <input
            autoFocus
            onChange={e => setName(e.target.value)}
            onKeyDown={async e => {
              if (e.key === "Enter") {
                await createChoice({
                  variables: {
                    name,
                    questionId: `${questionId}`,
                  },
                })
                setName("")
              }
            }}
            placeholder="Add Choice"
            type="text"
            value={name}
          />
        </div>
      )}
      <style jsx>{`
        div.addButton {
          padding-top: 1rem;
        }
        div.allChoices {
          padding-bottom: 1rem;
          padding-left: 1rem;
          background-color: #a1c9d4;
        }
        div.deleteChoice {
          margin-top: 1rem;
        }
        h4 {
          display: inline;
        }
        button {
          margin-left: 0.5rem;
          margin-right: 2rem;
        }
      `}</style>
    </div>
  )
}

export default Choices
