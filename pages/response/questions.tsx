import gql from "graphql-tag"
import { useQuery } from "@apollo/client"
import Choices from "./choices"

export const AnswersQuery = gql`
  query AnswersQuery($responseId: String!) {
    answers(responseId: $responseId) {
      id
      question {
        id
      }
      choice {
        id
      }
    }
  }
`

function Questions({ responseId, quizId, questions }) {
  const { loading, error, data } = useQuery(AnswersQuery, {
    variables: { responseId },
  })
  if (loading) {
    return <div>Loading ...</div>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <>
      <h2>Questions</h2>
      {questions &&
        questions.length > 0 &&
        questions.map(question => {
          const selectedAnswer = data.answers.find(answer => {
            return answer.question.id === question.id
          })
          return (
            <div key={question.id} className="question">
              <h4>{`${question.title} - (${question.points} points)`}</h4>
              <h4 key={question.id}></h4>
              <Choices
                selectedAnswer={selectedAnswer}
                responseId={responseId}
                questionId={question.id}
                choices={question.choices}
              />
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
