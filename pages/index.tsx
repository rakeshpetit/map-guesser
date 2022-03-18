import Layout from "../components/Layout"
import Link from "next/link"
import gql from "graphql-tag"
import { useQuery } from "@apollo/client"

const QuizesQuery = gql`
  query Quizes {
    quizes {
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

const Quiz = ({ quiz }) => {
  console.log("po", quiz)
  return (
    <Link href="/q/[id]" as={`/q/${quiz.id}`}>
      <a>
        <h2>{quiz.title}</h2>
        <small>By {quiz.author ? quiz.author.name : "Unknown Author"}</small>
        <style jsx>{`
          a {
            text-decoration: none;
            color: inherit;
            padding: 2rem;
            display: block;
          }
        `}</style>
      </a>
    </Link>
  )
}

const Quizes = () => {
  const { loading, error, data } = useQuery(QuizesQuery, {
    fetchPolicy: "cache-and-network",
  })

  if (loading) {
    return <div>Loading ...</div>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }

  return (
    <Layout>
      <div className="page">
        <h1>Quizes</h1>
        <main>
          {data.quizes.map(quiz => (
            <div key={quiz.id} className="post">
              <Quiz quiz={quiz} />
            </div>
          ))}
        </main>
      </div>
      <style jsx>{`
        .post {
          background: white;
          transition: box-shadow 0.1s ease-in;
        }

        .post:hover {
          box-shadow: 1px 1px 3px #aaa;
        }

        .post + .post {
          margin-top: 2rem;
        }
      `}</style>
    </Layout>
  )
}

export default Quizes
