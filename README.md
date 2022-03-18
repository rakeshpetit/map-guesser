# Fullstack Map guesser quiz app with Next.js (GraphQL API)

This example shows how to implement a **fullstack app in TypeScript with
[Next.js](https://nextjs.org/)** using [React](https://reactjs.org/), [Apollo
Client](https://www.apollographql.com/docs/react/) (frontend), [Nexus
Schema](https://nxs.li/components/standalone/schema) and [Prisma
Client](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client)
(backend). It uses a Postgres database hosted on Heroku.

## Getting started

### 1. Download and install dependencies

Clone the repo and install npm dependencies:

```
cd map-guesser
npm install
```

### 2. Create and seed the database

Ensure that you have a local Postgres database named `map_guesser`. Create an environment variable (`.env` file) with a DATABASE_URL with the connection string.

```
DATABASE_URL=postgresql://{username}:{password}@localhost/map_guesser
```

```
npx prisma migrate dev --name init
```

When `npx prisma migrate dev` is executed against a newly created database,
seeding is also triggered. The seed file in [`prisma/seed.ts`](./prisma/seed.ts)
will be executed and your database will be populated with the sample data.

### 3. Start the app

```
npm run dev
```

The app is now running, navigate to
[`http://localhost:3000/`](http://localhost:3000/) in your browser to explore
its UI.

## Using the GraphQL API

You can also access the GraphQL API of the API server directly. It is running on
the same host machine and port and can be accessed via the `/api` route (in this
case that is [`localhost:3000/api`](http://localhost:3000/api)).
