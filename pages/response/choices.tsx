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

function Choices({ questionId, choices }) {
  const [createAnswer, { loading }] = useMutation(CreateChoiceMutation, {
    refetchQueries: [
      {
        query: QuestionQuery,
        variables: { questionId: `${questionId}` },
      },
    ],
  })

  return (
    <div className="allChoices">
      {choices &&
        choices.length > 0 &&
        choices.map(choice => {
          return (
            <div key={choice.id} className="deleteChoice">
              <input
                type="radio"
                name={questionId}
                value={choice.id}
                onChange={async e => {
                  await createAnswer({
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
            </div>
          )
        })}
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
