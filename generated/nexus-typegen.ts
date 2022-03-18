/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
}

export interface NexusGenObjects {
  Mutation: {};
  Post: { // root type
    content?: string | null; // String
    id?: number | null; // Int
    published?: boolean | null; // Boolean
    title?: string | null; // String
  }
  Query: {};
  Question: { // root type
    id?: number | null; // Int
    title?: string | null; // String
  }
  Quiz: { // root type
    id?: number | null; // Int
    published?: boolean | null; // Boolean
    title?: string | null; // String
  }
  User: { // root type
    email?: string | null; // String
    id?: number | null; // Int
    name?: string | null; // String
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars

export interface NexusGenFieldTypes {
  Mutation: { // field return type
    createDraft: NexusGenRootTypes['Post'] | null; // Post
    createDraftQuiz: NexusGenRootTypes['Quiz'] | null; // Quiz
    createQuestion: NexusGenRootTypes['Question'] | null; // Question
    deletePost: NexusGenRootTypes['Post'] | null; // Post
    deleteQuestion: NexusGenRootTypes['Question'] | null; // Question
    deleteQuiz: NexusGenRootTypes['Quiz'] | null; // Quiz
    publish: NexusGenRootTypes['Post'] | null; // Post
    publishQuiz: NexusGenRootTypes['Quiz'] | null; // Quiz
    signupUser: NexusGenRootTypes['User'] | null; // User
  }
  Post: { // field return type
    author: NexusGenRootTypes['User'] | null; // User
    content: string | null; // String
    id: number | null; // Int
    published: boolean | null; // Boolean
    title: string | null; // String
  }
  Query: { // field return type
    draftQuizes: Array<NexusGenRootTypes['Quiz'] | null> | null; // [Quiz]
    drafts: Array<NexusGenRootTypes['Post'] | null> | null; // [Post]
    feed: Array<NexusGenRootTypes['Post'] | null> | null; // [Post]
    filterPosts: Array<NexusGenRootTypes['Post'] | null> | null; // [Post]
    post: NexusGenRootTypes['Post'] | null; // Post
    quiz: NexusGenRootTypes['Quiz'] | null; // Quiz
    quizes: Array<NexusGenRootTypes['Quiz'] | null> | null; // [Quiz]
  }
  Question: { // field return type
    id: number | null; // Int
    quiz: NexusGenRootTypes['Quiz'] | null; // Quiz
    title: string | null; // String
  }
  Quiz: { // field return type
    author: NexusGenRootTypes['User'] | null; // User
    id: number | null; // Int
    published: boolean | null; // Boolean
    questions: Array<NexusGenRootTypes['Question'] | null> | null; // [Question]
    title: string | null; // String
  }
  User: { // field return type
    email: string | null; // String
    id: number | null; // Int
    name: string | null; // String
    posts: Array<NexusGenRootTypes['Post'] | null> | null; // [Post]
  }
}

export interface NexusGenFieldTypeNames {
  Mutation: { // field return type name
    createDraft: 'Post'
    createDraftQuiz: 'Quiz'
    createQuestion: 'Question'
    deletePost: 'Post'
    deleteQuestion: 'Question'
    deleteQuiz: 'Quiz'
    publish: 'Post'
    publishQuiz: 'Quiz'
    signupUser: 'User'
  }
  Post: { // field return type name
    author: 'User'
    content: 'String'
    id: 'Int'
    published: 'Boolean'
    title: 'String'
  }
  Query: { // field return type name
    draftQuizes: 'Quiz'
    drafts: 'Post'
    feed: 'Post'
    filterPosts: 'Post'
    post: 'Post'
    quiz: 'Quiz'
    quizes: 'Quiz'
  }
  Question: { // field return type name
    id: 'Int'
    quiz: 'Quiz'
    title: 'String'
  }
  Quiz: { // field return type name
    author: 'User'
    id: 'Int'
    published: 'Boolean'
    questions: 'Question'
    title: 'String'
  }
  User: { // field return type name
    email: 'String'
    id: 'Int'
    name: 'String'
    posts: 'Post'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    createDraft: { // args
      authorEmail?: string | null; // String
      content?: string | null; // String
      title: string; // String!
    }
    createDraftQuiz: { // args
      authorEmail?: string | null; // String
      title: string; // String!
    }
    createQuestion: { // args
      quizId?: string | null; // String
      title: string; // String!
    }
    deletePost: { // args
      postId?: string | null; // String
    }
    deleteQuestion: { // args
      questionId?: string | null; // String
    }
    deleteQuiz: { // args
      quizId?: string | null; // String
    }
    publish: { // args
      postId?: string | null; // String
    }
    publishQuiz: { // args
      quizId?: string | null; // String
    }
    signupUser: { // args
      email: string; // String!
      name?: string | null; // String
    }
  }
  Query: {
    filterPosts: { // args
      searchString?: string | null; // String
    }
    post: { // args
      postId: string; // String!
    }
    quiz: { // args
      quizId: string; // String!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = never;

export type NexusGenEnumNames = never;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: any;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}