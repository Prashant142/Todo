import { useState, useEffect } from 'react';
import axios from 'axios';

const apiBase = "http://localhost:5000";
function App() {

  const [todos, setTodos] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newTodo, setNewTodo] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [clickedIds, setClickedIds] = useState([]);
  useEffect(() => {
    setLoading(true);
    GetTodos();
    setLoading(false);
    console.log(todos);
  }, [])

  const GetTodos = async () => {
    await axios.get(apiBase + "/todos")
      .then(response => setTodos(response.data))
      .catch(err => console.error("Error: ", err));
  }

  const addTodo = async () => {
    const data = await fetch(apiBase + "/todo/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: newTodo
      })
    }).then(res => res.json());

    setTodos([...todos, data]);

    setPopupActive(false);
    setNewTodo("");
  }

  const deleteTodo = async id => {
    const data = await fetch(apiBase + '/todo/delete/' + id, { method: "DELETE" }).then(res => res.json());

    setTodos(todos => todos.filter(todo => todo._id !== data.result._id));
  }

  const handleClick = (id) => {
    setClickedIds(clickedIds.includes(id) ? clickedIds.filter((i) => i !== id) : [...clickedIds, id]);
  };

  return (
    <div className="App">
      <h1>Hello, Prashant</h1>
      <h4>Your Tasks</h4>
      {
        isLoading ? (
          <h2>Loading...</h2>
        ) : (
          <div className="todos">
            {
              todos.map(todo => (
                <div key={todo._id} className="todo"
                onClick={() => handleClick(todo._id)}
                >
                  <div className="checkbox"></div>
                  <div className="text" >{clickedIds.includes(todo._id) ? <strike>{todo.text}</strike> : todo.text}</div>
                  <div className="delete-todo" onClick={() => deleteTodo(todo._id)}>x</div>
                </div>
              ))}
          </div>
        )
      }
      <div className='addPopup' onClick={() => setPopupActive(true)}>+</div>
      {
        popupActive ? (
          <div className='popup'>
            <div className='closePopup' onClick={() => setPopupActive(false)}>x</div>
            <div className='content'>
              <h3>Add task</h3>
              <input
                type='text'
                className="add-todo-input"
                onChange={e => setNewTodo(e.target.value)}
                value={newTodo}
              />
              <button className='button' onClick={addTodo}>Add task</button>
            </div>
          </div>
        ) : ''}
    </div>
  );
}

export default App;
