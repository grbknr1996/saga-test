import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "@redux-saga/core";
import { Todo, getTodos, updateTodo, deleteTodo, createTodo } from "./api";
import { put, takeEvery } from "redux-saga/effects";
//put: dispatch an action into the store (non-blocking)
/*
Redux-Sagas is based on generator functions. Whenever you call one of these, it gets executed until it reaches a yield. This, besides allowing you to perform async actions by waiting for promises, has a bunch of advantages when it comes to testing for example.

Esentially, mocking is what is trying to be avoided here when you are testing.
 In order to do so, a declarative approach is followed. T
 he point is that you don't dispatch (nor really do anything), 
 the middleware does. You only provide this middleware with objects called 
 Effects. So, what the put will do is to create an Effect object that 
 the middleware will "read". Then, it will dispatch the action 
 and use next(result) (with result being the result of whatever 
    the Effect told the middleware to do) 
to go to the next yield and get the next Effect.
 You can read more about it here.

Remember that the main advantages of redux-sagas when compared to redux-thunk appear when testing comes in. Being able to just declare which Effect will be returned by each put, call... and then just iterating from yield to yield instead of having to mock API calls or dispatches is a major selling point for redux-sagas. You probably need to read and practise a little bit more before you get the concept completely but I hope my explanation solves your doubt.
*/
function* getTodosAction() {
  const todos: Todo[] = yield getTodos();
  yield put({ type: "TODOS_FETCH_SUCCEEDED", payload: todos });
}

function* updateTodoAction({
  payload,
}: {
  type: "UPDATE_TODO_REQUESTED";
  payload: Todo;
}) {
  yield updateTodo(payload);
  yield put({ type: "TODOS_FETCH_REQUESTED" });
}

function* deleteTodoAction({
  payload,
}: {
  type: "DELETE_TODO_REQUESTED";
  payload: Todo;
}) {
  yield deleteTodo(payload);
  yield put({ type: "TODOS_FETCH_REQUESTED" });
}

function* createTodoAction({
  payload,
}: {
  type: "CREATE_TODO_REQUESTED";
  payload: string;
}) {
  yield createTodo(payload);
  yield put({ type: "TODOS_FETCH_REQUESTED" });
}

function* rootSaga() {
  yield takeEvery("TODOS_FETCH_REQUESTED", getTodosAction);
  yield takeEvery("UPDATE_TODO_REQUESTED", updateTodoAction);
  yield takeEvery("DELETE_TODO_REQUESTED", deleteTodoAction);
  yield takeEvery("CREATE_TODO_REQUESTED", createTodoAction);
}

const reducer = (
  state: Todo[] = [],
  action: { type: string; payload: Todo[] }
) => {
  switch (action.type) {
    case "TODOS_FETCH_SUCCEEDED":
      return action.payload;
    default:
      return state;
  }
};
export type RootState = ReturnType<typeof reducer>;
const sagaMiddleware = createSagaMiddleware();

export const store = createStore(reducer, applyMiddleware(sagaMiddleware));

sagaMiddleware.run(rootSaga);

export const selectTodos = (state: Todo[]) => state;

export const fetchTodos = () => ({
  type: "TODOS_FETCH_REQUESTED",
});

export const toggleTodo = (todo: Todo) => ({
  type: "UPDATE_TODO_REQUESTED",
  payload: {
    ...todo,
    done: !todo.done,
  },
});

export const removeTodo = (todo: Todo) => ({
  type: "DELETE_TODO_REQUESTED",
  payload: todo,
});

export const addTodo = (text: string) => ({
  type: "CREATE_TODO_REQUESTED",
  payload: text,
});
