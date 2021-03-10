const express = require("express");
const req = require("request");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const userExists = users.find((user) => user.username === username);

  if (!userExists) {
    return response.status(404).json({
      error: "User nao existe",
    });
    e;
  }

  request.user = userExists;
  next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const usernameExists = users.find((user) => user.username === username);

  if (usernameExists) {
    return response.status(400).json({ error: "Username is already in use" });
  }
  console.log(username);

  const user = {
    id: uuidv4(),
    name,
    username,
    todos: [],
  };

  users.push(user);
  return response.status(200).json(user);
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.status(200).json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const newTodo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: Date.now(),
  };

  user.todos.push(newTodo);

  return response.status(201).json(newTodo);
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const todoExists = user.todos.find((todo) => todo.id === id);

  if (!todoExists) {
    return response.status(404).json({ error: "Not Found" });
  }

  const [todo] = user.todos.map((todo) => {
    if (todo.id === id) {
      todo.title = title;
      todo.deadline = deadline;

      return todo;
    }
  });
  return response.json(todo);
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoExists = user.todos.find((todo) => todo.id === id);

  if (!todoExists) {
    return response.status(404).json({ error: "Not Found" });
  }
  todoExists.done = true;

  return response.status(201).json(todoExists);
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoExists = user.todos.find((todo) => todo.id === id);

  if (!todoExists) {
    return response.status(404).json({ error: "Not Found" });
  }
  console.log(todoExists);
  user.todos.splice(todoExists.id, 1);

  return response.status(204).json(user.todos);
});

module.exports = app;
