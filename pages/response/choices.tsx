import gql from "graphql-tag"
import { useMutation } from "@apollo/client"
import { AnswersQuery } from "./questions"

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

const CreateAnswerMutation = gql`
  mutation CreateAnswer(
    $responseId: String!
    $questionId: String!
    $choiceId: String!
  ) {
    createAnswer(
      responseId: $responseId
      questionId: $questionId
      choiceId: $choiceId
    ) {
      id
    }
  }
`

function Choices({ questionId, responseId, choices, selectedAnswer }) {
  const [createAnswer, { loading }] = useMutation(CreateAnswerMutation, {
    refetchQueries: [
      {
        query: AnswersQuery,
        variables: { responseId: `${responseId}` },
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
                      responseId: responseId,
                      questionId: `${questionId}`,
                      choiceId: `${e.target.value}`,
                    },
                  })
                }}
                checked={selectedAnswer?.choice?.id === choice.id}
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
