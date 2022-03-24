import Layout from "../../components/Layout"
import { useRouter } from "next/router"
import gql from "graphql-tag"
import { useQuery } from "@apollo/client"

const StatisticsQuery = gql`
  query statisticsQuery($quizId: String!) {
    statistics(quizId: $quizId) {
      playersCount
      players {
        player {
          name
          email
        }
        score
        questionScores {
          questionId
          correctAnswer
          answered
        }
      }
    }
  }
`

function Results() {
  const quizId = useRouter().query.id
  const { loading, error, data } = useQuery(StatisticsQuery, {
    variables: { quizId: `${quizId}` },
  })

  if (loading) {
    return <div>Loading ...</div>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }
  const { playersCount, players } = data.statistics

  return (
    <Layout>
      <div>
        <h2>Results</h2>
        <span>Number of players:</span>
        <h3 className="playersCount">{playersCount}</h3>
        {players.map(item => {
          const { player, score, questionScores } = item
          return (
            <div className="players" key={player.id}>
              <div className="playerInfo">
                <h3 className="players">{player.name}</h3>
                <h4 className="playersCount"> - {score} points</h4>
              </div>
              <div className="boxes">
                {questionScores.map(questionScore => {
                  return (
                    <div key={`${player.id}-${questionScore.questionId}`}>
                      {questionScore.answered &&
                        questionScore.correctAnswer && (
                          <div className="greenBox"></div>
                        )}
                      {questionScore.answered &&
                        !questionScore.correctAnswer && (
                          <div className="redBox"></div>
                        )}
                      {!questionScore.answered && (
                        <div className="grayBox"></div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      <style jsx>{`
        input {
          display: block;
          margin: 0 1rem 1rem 1rem;
        }
        .buttonLayout {
          display: block;
        }
        div.players {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        div.playerInfo {
          display: flex;
          flex-direction: row;
        }
        h3.players {
          display: flex;
          flex-direction: row;
          margin-right: 0.25rem;
        }
        .playersCount {
          display: inline;
          margin-left: 0.25rem;
        }
        span.secret {
          display: inline;
          margin-right: 0.25rem;
        }
        div.boxes {
          display: flex;
          align-items: flex-start;
        }
        .grayBox {
          margin-right: 0.25rem;
          height: 2rem;
          width: 2rem;
          background-color: gray;
        }
        .greenBox {
          margin-right: 0.25rem;
          height: 2rem;
          width: 2rem;
          background-color: green;
        }
        .redBox {
          margin-right: 0.25rem;
          height: 2rem;
          width: 2rem;
          background-color: red;
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

export default Results
