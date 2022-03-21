import { ApolloServer } from "apollo-server-micro"
import { DateTimeResolver } from "graphql-scalars"
import { NextApiHandler } from "next"
import {
  asNexusMethod,
  booleanArg,
  makeSchema,
  nonNull,
  nullable,
  objectType,
  stringArg,
} from "nexus"
import path from "path"
import cors from "micro-cors"
import prisma from "../../lib/prisma"

export const GQLDate = asNexusMethod(DateTimeResolver, "date")

const User = objectType({
  name: "User",
  definition(t) {
    t.int("id")
    t.string("name")
    t.string("email")
    t.list.field("posts", {
      type: "Post",
      resolve: parent =>
        prisma.user
          .findUnique({
            where: { id: Number(parent.id) },
          })
          .posts(),
    })
  },
})

const Post = objectType({
  name: "Post",
  definition(t) {
    t.int("id")
    t.string("title")
    t.nullable.string("content")
    t.boolean("published")
    t.nullable.field("author", {
      type: "User",
      resolve: parent =>
        prisma.post
          .findUnique({
            where: { id: Number(parent.id) },
          })
          .author(),
    })
  },
})

const Quiz = objectType({
  name: "Quiz",
  definition(t) {
    t.int("id")
    t.string("title")
    t.string("secret")
    t.boolean("published")
    t.nullable.field("author", {
      type: "User",
      resolve: parent =>
        prisma.quiz
          .findUnique({
            where: { id: Number(parent.id) },
          })
          .author(),
    })
    t.list.field("questions", {
      type: "Question",
      resolve: parent =>
        prisma.quiz
          .findUnique({
            where: { id: Number(parent.id) },
          })
          .questions(),
    })
    t.list.field("responses", {
      type: "Response",
      resolve: parent =>
        prisma.quiz
          .findUnique({
            where: { id: Number(parent.id) },
          })
          .responses(),
    })
  },
})

const Question = objectType({
  name: "Question",
  definition(t) {
    t.int("id")
    t.string("title")
    t.int("points")
    t.nullable.field("quiz", {
      type: "Quiz",
      resolve: parent =>
        prisma.question
          .findUnique({
            where: { id: Number(parent.id) },
          })
          .quiz(),
    })
    t.list.field("choices", {
      type: "Choice",
      resolve: parent =>
        prisma.question
          .findUnique({
            where: { id: Number(parent.id) },
          })
          .choices(),
    })
  },
})

const Choice = objectType({
  name: "Choice",
  definition(t) {
    t.int("id")
    t.string("name")
    t.boolean("correct")
    t.nullable.field("question", {
      type: "Question",
      resolve: parent =>
        prisma.choice
          .findUnique({
            where: { id: Number(parent.id) },
          })
          .question(),
    })
  },
})

const Response = objectType({
  name: "Response",
  definition(t) {
    t.int("id")
    t.nullable.field("author", {
      type: "User",
      resolve: parent =>
        prisma.quiz
          .findUnique({
            where: { id: Number(parent.id) },
          })
          .author(),
    })
    t.nullable.field("quiz", {
      type: "Quiz",
      resolve: parent =>
        prisma.question
          .findUnique({
            where: { id: Number(parent.id) },
          })
          .quiz(),
    })
  },
})

const Query = objectType({
  name: "Query",
  definition(t) {
    t.field("post", {
      type: "Post",
      args: {
        postId: nonNull(stringArg()),
      },
      resolve: (_, args) => {
        return prisma.post.findUnique({
          where: { id: Number(args.postId) },
        })
      },
    })

    t.list.field("feed", {
      type: "Post",
      resolve: (_parent, _args) => {
        return prisma.post.findMany({
          where: { published: true },
        })
      },
    })

    t.list.field("drafts", {
      type: "Post",
      resolve: (_parent, _args, ctx) => {
        return prisma.post.findMany({
          where: { published: false },
        })
      },
    })

    t.list.field("filterPosts", {
      type: "Post",
      args: {
        searchString: nullable(stringArg()),
      },
      resolve: (_, { searchString }, ctx) => {
        return prisma.post.findMany({
          where: {
            OR: [
              { title: { contains: searchString } },
              { content: { contains: searchString } },
            ],
          },
        })
      },
    })

    t.list.field("draftQuizes", {
      type: "Quiz",
      resolve: (_parent, _args, ctx) => {
        return prisma.quiz.findMany({
          where: { published: false },
        })
      },
    })

    t.list.field("quizes", {
      type: "Quiz",
      resolve: (_parent, _args) => {
        return prisma.quiz.findMany({
          where: { published: true },
        })
      },
    })

    t.field("quiz", {
      type: "Quiz",
      args: {
        quizId: nonNull(stringArg()),
      },
      resolve: (_, args) => {
        return prisma.quiz.findUnique({
          where: { id: Number(args.quizId) },
        })
      },
    })

    t.field("question", {
      type: "Question",
      args: {
        questionId: nonNull(stringArg()),
      },
      resolve: (_, args) => {
        return prisma.question.findUnique({
          where: { id: Number(args.questionId) },
        })
      },
    })
  },
})

const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.field("signupUser", {
      type: "User",
      args: {
        name: stringArg(),
        email: nonNull(stringArg()),
      },
      resolve: (_, { name, email }, ctx) => {
        return prisma.user.create({
          data: {
            name,
            email,
          },
        })
      },
    })

    t.nullable.field("deletePost", {
      type: "Post",
      args: {
        postId: stringArg(),
      },
      resolve: (_, { postId }, ctx) => {
        return prisma.post.delete({
          where: { id: Number(postId) },
        })
      },
    })

    t.field("createDraft", {
      type: "Post",
      args: {
        title: nonNull(stringArg()),
        content: stringArg(),
        authorEmail: stringArg(),
      },
      resolve: (_, { title, content, authorEmail }, ctx) => {
        return prisma.post.create({
          data: {
            title,
            content,
            published: false,
            author: {
              connect: { email: authorEmail },
            },
          },
        })
      },
    })

    t.nullable.field("publish", {
      type: "Post",
      args: {
        postId: stringArg(),
      },
      resolve: (_, { postId }, ctx) => {
        return prisma.post.update({
          where: { id: Number(postId) },
          data: { published: true },
        })
      },
    })

    t.field("createDraftQuiz", {
      type: "Quiz",
      args: {
        title: nonNull(stringArg()),
        secret: stringArg(),
        authorEmail: stringArg(),
      },
      resolve: (_, { title, secret, authorEmail }, ctx) => {
        return prisma.quiz.create({
          data: {
            title,
            secret,
            published: false,
            author: {
              connect: { email: authorEmail },
            },
          },
        })
      },
    })

    t.field("updateQuiz", {
      type: "Quiz",
      args: {
        quizId: nonNull(stringArg()),
        title: stringArg(),
        secret: stringArg(),
      },
      resolve: async (_, { title, quizId, secret }, ctx) => {
        const quiz = await prisma.quiz.findUnique({
          where: { id: Number(quizId) },
        })
        return prisma.quiz.update({
          data: {
            title: title || quiz.title,
            secret: secret || quiz.secret,
          },
          where: {
            id: Number(quizId),
          },
        })
      },
    })

    t.nullable.field("publishQuiz", {
      type: "Quiz",
      args: {
        quizId: stringArg(),
      },
      resolve: (_, { quizId }, ctx) => {
        return prisma.quiz.update({
          where: { id: Number(quizId) },
          data: { published: true },
        })
      },
    })

    t.nullable.field("deleteQuiz", {
      type: "Quiz",
      args: {
        quizId: stringArg(),
      },
      resolve: (_, { quizId }, ctx) => {
        return prisma.quiz.delete({
          where: { id: Number(quizId) },
        })
      },
    })

    t.field("createQuestion", {
      type: "Question",
      args: {
        quizId: nonNull(stringArg()),
        title: nonNull(stringArg()),
        points: stringArg(),
      },
      resolve: (_, { title, quizId, points = 1 }, ctx) => {
        return prisma.question.create({
          data: {
            title,
            points: Number(points),
            quiz: {
              connect: { id: Number(quizId) },
            },
          },
        })
      },
    })

    t.field("updateQuestion", {
      type: "Question",
      args: {
        questionId: stringArg(),
        title: stringArg(),
        points: stringArg(),
      },
      resolve: async (_, { title, questionId, points }, ctx) => {
        const question = await prisma.question.findUnique({
          where: { id: Number(questionId) },
        })
        return prisma.question.update({
          data: {
            title: title || question.title,
            points: Number(points || question.points),
          },
          where: {
            id: Number(questionId),
          },
        })
      },
    })

    t.nullable.field("deleteQuestion", {
      type: "Question",
      args: {
        questionId: stringArg(),
      },
      resolve: (_, { questionId }, ctx) => {
        return prisma.question.delete({
          where: { id: Number(questionId) },
        })
      },
    })

    t.field("createChoice", {
      type: "Choice",
      args: {
        questionId: stringArg(),
        name: nonNull(stringArg()),
        correct: booleanArg(),
      },
      resolve: (_, { questionId, name, correct }, ctx) => {
        return prisma.choice.create({
          data: {
            name,
            correct,
            question: {
              connect: { id: Number(questionId) },
            },
          },
        })
      },
    })

    t.field("updateChoice", {
      type: "Choice",
      args: {
        choiceId: nonNull(stringArg()),
        name: stringArg(),
        correct: booleanArg(),
      },
      resolve: async (_, { name, choiceId, correct }, ctx) => {
        const choice = await prisma.choice.findUnique({
          where: { id: Number(choiceId) },
        })

        if (correct) {
          await prisma.choice.updateMany({
            data: {
              correct: false,
            },
            where: {
              questionId: choice.questionId,
            },
          })
        }

        return prisma.choice.update({
          data: {
            name: name || choice.name,
            correct: correct || choice.correct,
          },
          where: {
            id: Number(choiceId),
          },
        })
      },
    })

    t.nullable.field("deleteChoice", {
      type: "Choice",
      args: {
        choiceId: stringArg(),
      },
      resolve: (_, { choiceId }, ctx) => {
        return prisma.choice.delete({
          where: { id: Number(choiceId) },
        })
      },
    })

    t.field("createResponse", {
      type: "Response",
      args: {
        quizId: nonNull(stringArg()),
        secret: nonNull(stringArg()),
        userEmail: nonNull(stringArg()),
      },
      resolve: async (_, { quizId, secret, userEmail }, ctx) => {
        const quiz = await prisma.quiz.findUnique({
          where: { id: Number(quizId) },
        })
        const user = await prisma.user.findUnique({
          where: { email: userEmail },
        })
        if (secret === quiz.secret && user) {
          const response = await prisma.response.findFirst({
            where: { quizId: Number(quizId), authorId: user.id },
          })
          if (response) {
            return response
          }
          return prisma.response.create({
            data: {
              quiz: {
                connect: { id: Number(quizId) },
              },
              author: {
                connect: { email: userEmail },
              },
            },
          })
        } else {
          throw new Error("Either the user email or secret is invalid.")
        }
      },
    })
  },
})

export const schema = makeSchema({
  types: [
    Query,
    Mutation,
    Post,
    User,
    Quiz,
    Question,
    Choice,
    Response,
    GQLDate,
  ],
  outputs: {
    typegen: path.join(process.cwd(), "generated/nexus-typegen.ts"),
    schema: path.join(process.cwd(), "generated/schema.graphql"),
  },
})

export const config = {
  api: {
    bodyParser: false,
  },
}

const apolloServer = new ApolloServer({ schema })

let apolloServerHandler: NextApiHandler

async function getApolloServerHandler() {
  if (!apolloServerHandler) {
    await apolloServer.start()

    apolloServerHandler = apolloServer.createHandler({
      path: "/api",
    })
  }

  return apolloServerHandler
}

const handler: NextApiHandler = async (req, res) => {
  const apolloServerHandler = await getApolloServerHandler()

  if (req.method === "OPTIONS") {
    res.end()
    return
  }

  return apolloServerHandler(req, res)
}

export default cors()(handler)
