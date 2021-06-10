'use strict';

const
    form = document.querySelector('.todo-control'),
    input = document.querySelector('.header-input'),
    todoList = document.querySelector('.todo-list'),
    todoCompleted = document.querySelector('.todo-completed'),
    todoData = [],
    saveStorage = function () {
        localStorage.clear();
        for (let i = 0; i < todoData.length; i++) {
            localStorage[i] = JSON.stringify(todoData[i]);
        }        
    },
    loadStorage = function () {
        for (let i = 0; i < localStorage.length; i++) {
            todoData[i] = JSON.parse(localStorage[i]);
        }        
    },
    render = function () {
        todoList.textContent = '';
        todoCompleted.textContent = '';
        
        loadStorage();
        
        todoData.forEach(function (item) {
            const li = document.createElement('li');
            li.classList.add('todo-item');
            li.innerHTML = 
			'<span class="text-todo">' + item.value + '</span>' +
			'<div class="todo-buttons">' +
				'<button class="todo-remove"></button>' +
				'<button class="todo-complete"></button>' +
			'</div> ';
            if (item.completed) {
                todoCompleted.append(li);                
            } else {
                todoList.append(li);
            }
            const removeBtn = li.querySelector('.todo-remove');
            const completeBtn = li.querySelector('.todo-complete');
            removeBtn.addEventListener('click', function () {
                todoData.splice(todoData.indexOf(item), 1);
                saveStorage();
                render();    
            });
            completeBtn.addEventListener('click', function () {
                item.completed = !item.completed;
                saveStorage();
                render();    
            });
        });
    };

form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (input.value.trim() !== '') {
        const newTodo = {
            value: input.value.trim(),
            completed: false
        };   
        todoData.push(newTodo);
        saveStorage();
        render();
    }
    input.value = '';
});

render();