import gql from "graphql-tag"
import { useMutation } from "@apollo/client"
import { useState } from "react"

const QuestionQuery = gql`
  query Question($questionId: String!) {
    question(questionId: $questionId) {
      id
      title
      choices {
        id
        name
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

  const [createQuestion, { loading }] = useMutation(CreateChoiceMutation, {
    refetchQueries: [
      {
        query: QuestionQuery,
        variables: { questionId: `${questionId}` },
      },
    ],
  })

  const [deleteQuestion, { loading: loadingDelete }] = useMutation(
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
            <div className="deleteChoice">
              <h4 key={choice.id}>{choice.name}</h4>
              <button
                onClick={async e => {
                  setDeletingChoiceId(choice.id)
                  await deleteQuestion({
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
        <h4>"Saving..."</h4>
      ) : (
        <div className="addButton">
          <input
            autoFocus
            onChange={e => setName(e.target.value)}
            onKeyDown={async e => {
              if (e.key === "Enter") {
                await createQuestion({
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
