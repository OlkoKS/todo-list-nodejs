"use strict"

const form = document.querySelector('.js--form');
const todoList = document.querySelector(('.js--todos-wrapper'));

createTodoList();

async function createTodoList() {
    const todos = await getTodos();
    todos.forEach(createTodoElement);
}

async function getTodos() {
    try {
        const res = await fetch('http://localhost:3002/todos', {
            method: 'GET', headers: {
                'Content-Type': 'application/json'
            }
        })
        return await res.json();
    } catch (err) {
        console.log(err);
    }
}

function createTodoElement(data) {
    const listItem = document.createElement('li');
    listItem.setAttribute('class', 'todo-item');
    listItem.setAttribute('id', data._id);
    const checkboxElement = document.createElement('input');
    checkboxElement.setAttribute('type', 'checkbox');
    const spanElement = document.createElement('span');
    spanElement.setAttribute('class', 'todo-item__description');
    spanElement.textContent = data.text;
    const buttonElement = document.createElement('button');
    buttonElement.setAttribute('class', 'todo-item__delete');
    buttonElement.textContent = 'Delete';

    if (data.isDone === true) {
        listItem.classList.add('todo-item--checked');
        checkboxElement.setAttribute('checked', 'true');
    }

    listItem.appendChild(checkboxElement);
    listItem.appendChild(spanElement);
    listItem.appendChild(buttonElement);
    todoList.insertAdjacentElement('beforeend', listItem);
}

async function addTodo(event) {
    event.preventDefault();

    const newTodoData = {
        text: event.target.value.value, isDone: false
    }

    try {
        const res = await fetch('http://localhost:3002/todos', {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify(newTodoData)
        })

        const data = await res.json();
        console.log(data);

        todoList.innerHTML = '';
        await createTodoList();
        form.reset();

    } catch (err) {
        console.log(err);
    }
}

async function setChecking(event) {
    if (event.target.tagName === 'INPUT') {
        const todoItem = event.target.parentElement;
        const todoItemId = todoItem.id;
        let updatedTodo = {};

        todoItem.classList.contains('todo-item--checked') ? updatedTodo.isDone = false : updatedTodo.isDone = true

        try {
            const res = await fetch(`http://localhost:3002/todos/${todoItemId}`, {
                method: 'PUT', headers: {
                    'Content-Type': 'application/json'
                }, body: JSON.stringify(updatedTodo)
            })

            const data = await res.json();
            console.log(data);

            todoItem.classList.toggle('todo-item--checked');
        } catch (err) {
            console.log(err);
        }
    }
}

async function deleteTodo(event) {
    console.log(event.target.tagName);
    if (event.target.tagName === 'BUTTON') {
        const todoId = event.target.parentElement.id;
        console.log(todoId);

        try {
            const res = await fetch(`http://localhost:3002/todos/${todoId}`, {
                method: 'DELETE', headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await res.json();
            console.log(data);

            todoList.innerHTML = '';
            await createTodoList();
        } catch (err) {
            console.log(err);
        }
    }
}

form.addEventListener('submit', addTodo);
todoList.addEventListener('click', setChecking);
todoList.addEventListener('click', deleteTodo);