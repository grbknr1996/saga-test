import React, { useEffect, useRef, useCallback } from "react";
import { Provider, useSelector, useDispatch } from "react-redux";
import { Todo } from "./lib/api";
import {
  store,
  selectTodos,
  fetchTodos,
  toggleTodo,
  removeTodo,
  addTodo,
} from "./lib/store";
import "./App.css";

function TodoApp() {
  const dispatch = useDispatch();
  const todos = useSelector(selectTodos);
  useEffect(() => {
    dispatch(fetchTodos());
  }, []);

  const textRef = useRef<HTMLInputElement>(null);
  const onAdd = useCallback(() => {
    dispatch(addTodo(textRef.current!.value));
    textRef.current!.value = "";
  }, [dispatch]);
  /*
TypeScript assumes that variable a may be null since there is 
no guarantee for this element to exists. So before you can access that variable, 
you have put in if guard. 
But if you know that your application is always going to have an 
HTML element with id #hello, then you can rewrite above code as:

const a = document.getElementById('hello');

a!.style.width = '100px';
*/
  return (
    <div className="App">
      <div className="todos">
        {todos?.map((todo: Todo) => (
          <React.Fragment key={todo.id}>
            <div>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => dispatch(toggleTodo(todo))}
              />
              <span>{todo.text}</span>
            </div>
            <button onClick={() => dispatch(removeTodo(todo))}>Delete</button>
          </React.Fragment>
        ))}
      </div>

      <div className="add">
        <input type="text" ref={textRef} />
        <button onClick={onAdd}>Add</button>
      </div>
    </div>
  );
}
function App() {
  return (
    <Provider store={store}>
      <TodoApp />
    </Provider>
  );
}

export default App;
