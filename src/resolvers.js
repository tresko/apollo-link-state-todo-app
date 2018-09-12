import gql from "graphql-tag";

export const defaults = {
  allTodoes: [],
  visibilityFilter: "SHOW_ALL"
};

let nextTodoId = 0;

export const resolvers = {
  Mutation: {
    updateVisibilityFilter: (_, { visibilityFilter }, { cache }) => {
      const data = {
        visibilityFilter,
        __typename: "VisibilityxFilter"
      };
      cache.writeData({ data });
    },
    addTodoes: (_, { text }, { cache }) => {
      const query = gql`
        query GetTodos {
          allTodoes @client {
            id
            text
            completed
          }
        }
      `;
      const previous = cache.readQuery({ query });
      const newTodo = {
        id: nextTodoId++,
        text,
        completed: false,
        __typename: "Todo"
      };
      const data = {
        allTodoes: previous.allTodoes.concat([newTodo])
      };
      cache.writeData({ data });
      return newTodo;
    },
    toggleTodo: (_, { id }, { cache, getCacheKey }) => {
      console.log("test");
      const fragmentId = getCacheKey({ __typename: 'Todo', id });
      const fragment = gql`
          fragment completeTodo on Todo {
              completed
          }
      `;
      const todo = cache.readFragment({ fragment, id: fragmentId });
      const data = { ...todo, completed: !todo.completed };
      cache.writeData({ id: fragmentId, data });
      return null;
    },
  }
};
