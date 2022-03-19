import React, { useState } from "react"
import Layout from "../components/Layout"
import Router from "next/router"
import gql from "graphql-tag"
import { useMutation } from "@apollo/client"
import { DraftsQuery } from "./drafts"

const CreateDraftQuizMutation = gql`
  mutation CreateDraftQuizMutation($title: String!, $authorEmail: String!) {
    createDraftQuiz(title: $title, authorEmail: $authorEmail) {
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

function Draft(props) {
  const [title, setTitle] = useState("")
  const [authorEmail, setAuthorEmail] = useState("")

  const [createDraftQuiz, { loading, error, data }] = useMutation(
    CreateDraftQuizMutation,
    {
      refetchQueries: [
        {
          query: DraftsQuery,
        },
      ],
    }
  )

  return (
    <Layout>
      <div>
        <form
          onSubmit={async e => {
            e.preventDefault()

            await createDraftQuiz({
              variables: {
                title,
                authorEmail,
              },
            })
            Router.push("/drafts")
          }}
        >
          <h1>Create Quiz</h1>
          <input
            autoFocus
            onChange={e => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
          />
          <input
            onChange={e => setAuthorEmail(e.target.value)}
            placeholder="Author (email adress)"
            type="text"
            value={authorEmail}
          />
          <input
            disabled={!title || !authorEmail}
            type="submit"
            value="Create"
          />
          <a className="back" href="#" onClick={() => Router.push("/")}>
            or Cancel
          </a>
        </form>
      </div>
      <style jsx>{`
        .page {
          background: white;
          padding: 3rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        input[type="text"],
        textarea {
          width: 100%;
          padding: 0.5rem;
          margin: 0.5rem 0;
          border-radius: 0.25rem;
          border: 0.125rem solid rgba(0, 0, 0, 0.2);
        }

        input[type="submit"] {
          background: #ececec;
          border: 0;
          padding: 1rem 2rem;
        }

        .back {
          margin-left: 1rem;
        }
      `}</style>
    </Layout>
  )
}

export default Draft
