'use strict';

class Todo {
    constructor(form, input, todoList, todoCompleted) {
        this.form = document.querySelector(form);
        this.input = document.querySelector(input);
        this.todoList = document.querySelector(todoList);
        this.todoCompleted = document.querySelector(todoCompleted);
        this.todoData = new Map(JSON.parse(localStorage.getItem('todoList')));
    }
    saveStorage () {
        localStorage.setItem('todoList', JSON.stringify([...this.todoData]));    
    }
    render() {
        this.todoList.textContent = '';
        this.todoCompleted.textContent = '';
        this.todoData.forEach(item => this.createItem(item), this);
        this.saveStorage();
    }
    createItem(todo) {
        const
            li = document.createElement('li'),
            getMarkClass = () => todo.editable ? '' : ' hidden';
        li.classList.add('todo-item');
        li.dataset.key = todo.key;

        li.innerHTML = `
            <span class="text-todo" contenteditable="${todo.editable}">${todo.value}</span>
            <div class="todo-buttons">
                <button class="todo-edit">
                    <div class="edit-save${getMarkClass()}"></div>
                </button>
                <button class="todo-remove"></button>
                <button class="todo-complete"></button>
            </div>
        `;
        if (todo.completed) {
            this.todoCompleted.append(li);
        } else {
            this.todoList.append(li);
        }
    }
    addTodo(event) {
        event.preventDefault();    
        if (this.input.value.trim()) {
            const newTodo = {
                value: this.input.value.trim(),
                completed: false,
                editable: false,
                key: this.generateKey()
            };   
            this.todoData.set(newTodo.key, newTodo);
            this.render();
        } else {
            alert('Пустое дело добавить нельзя!');
        }
        this.input.value = '';
    }
    generateKey() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    editItem(li, key) {
        const todo = this.todoData.get(key);
        const text = li.querySelector('.text-todo').innerHTML;
        const mark = li.querySelector('.edit-save');
        todo.editable = !todo.editable; 
        todo.value = text;
        this.render();
        mark.classList.toggle('hidden');
    }
    deleteItem(key) {
        this.todoData.delete(key);
        this.render();
    }
    completeItem(key) {
        const todo = this.todoData.get(key);
        todo.completed = !todo.completed;
        this.render();        
    }
    handler() {
        window.addEventListener('click', event => {
            const target = event.target;
            const li = event.target.closest('.todo-item');
            if (!li) {
                return;          
            }
            const key = li.dataset.key; 
            if (target.closest('.todo-edit')) {
                this.editItem(li, key);
            }
            if (target.classList.contains('todo-remove')) {
                this.deleteItem(key);
            }
            if (target.classList.contains('todo-complete')) {
                this.completeItem(key);
            }
        });
        
    }
    init() {
        this.form.addEventListener('submit', this.addTodo.bind(this));
        this.render();
        this.handler();
    }
}

const todo = new Todo('.todo-control', '.header-input', '.todo-list', '.todo-completed');

todo.init();
