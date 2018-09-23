import React from "react";
import { render } from "react-dom";
import { ApolloClient } from "apollo-client";
import { withClientState } from "apollo-link-state";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "react-apollo";

import App from "./components/App";
import { resolvers, defaults } from "./resolvers";

const cache = new InMemoryCache();

const typeDefs = `
  enum VisibilityFilterEnum {
    SHOW_ALL
    SHOW_COMPLETED
    SHOW_ACTIVE
  }
  
  type Todo {
    id: ID!
    title: String!
    completed: Boolean!
  }

  type Mutation {
    addTodo(title: String!): Todo
    toggleTodo(id: String!): Todo
    updateVisibilityFilter(filter: VisibilityFilterEnum!): VisibilityFilterEnum
  }

  type Query {
    visibilityFilter: VisibilityFilterEnum
    todos: [Todo]
  }
`;

const client = new ApolloClient({
  cache,
  link: withClientState({ resolvers, defaults, cache, typeDefs })
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);
