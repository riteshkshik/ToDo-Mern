import { useState, useEffect } from "react";

const API_BASE = "https://todo-mern-peik.onrender.com";
// const API_BASE = "http://localhost:3001";

function App() {

  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");

  useEffect(() =>{
    GetTodos();

    // console.log(todos);
  }, []);

  const GetTodos = () => {
    fetch(`${API_BASE}/todos`)
      .then((res) => {
        // console.log(res);
        return res.json();
      })
      .then((data) => setTodos(data))
      .catch((err) => console.error("error: ", err));
  }

  function completeTodo(todoId){
    fetch(`${API_BASE}/todo/complete/${todoId}`,{method: 'PUT'})
      .then(res =>{
        return res.json();
      })
      .then(data => {
        setTodos(
          todos.map(todo =>{
            if(todo._id === data._id){
              todo.complete = data.complete;
            }
            return todo;
          })
        )
      })
  }

  const AddTodo = async () => {
    const data = await fetch(`${API_BASE}/todo/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: newTodo
      })
    }).then(res => res.json())

    setTodos([...todos, data]);
    setPopupActive(false);
    setNewTodo("");
  }

  function deleteTodo(todoId, event){
    event.stopPropagation();
    fetch(`${API_BASE}/todo/delete/${todoId}`,{method: 'DELETE'})
      .then(res =>{
        return res.json();
      })
      .then(data => {
        setTodos(todos => todos.filter(todo => todo._id !== data._id));
      })
  }

  return (
    <div className="App">
      <h1>Welcome Ritesh</h1>
      <h4>Your Tasks</h4>
      <div className="todos">

        {
          todos.map(todo => (
              <div className={
                "todo " + (todo.complete ? "is-complete": "") 
                } key={todo._id} onClick={() => completeTodo(todo._id)}>
                <div className="checkbox"></div>
                <div className="text">{todo.text}</div>
                <div className="delete-todo" onClick={(event) => deleteTodo(todo._id, event)}>x</div>
            </div>
          ))
        }
      </div>

      <div className="addPopup" onClick={() => setPopupActive(true)}>+</div>
      { popupActive ? (
        <div className="popup">
          <div className="closePopup" onClick={() => setPopupActive(false)}>x</div>
          <div className="content">
            <h3>Add Task</h3>
            <input autoFocus='true' type="text" className="add-todo-input" 
                   onChange={e => setNewTodo(e.target.value)} value={newTodo} onKeyPress={(e) => e.key === 'Enter' ? AddTodo() : null}/>
            <button className="button" onClick={AddTodo}>Create Todo</button>
          </div>
        </div>
      ) : '' }

    </div>
  );
}

export default App;
