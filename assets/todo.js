// Model
class Task {
    #data = {
        description: '',
        completed: false,
        blocked: false,
    };

    constructor(data) {
        Task.#validateData(data);

        this.#data = {
            ...this.#data,
            ...data,
        };
    }

    static isDataValid(data) {
        const result = (valid, message) => ({ valid, message });

        try {
            Task.#validateData(data);
            return result(true, 'all fields are valid.');
        } catch (e) {
            return result(false, e.message);
        }
    }

    static #validateData(data) {
        if (
            !data ||
            typeof data !== 'object' ||
            Array.isArray(data) ||
            Object.values(data).length === 0
        ) {
            throw new Error(
                `You must pass an object to the constructor with a description(string) field, and can also contain a completed(boolean) field and a blocked(boolean) field`
            );
        }
        if (!data?.description) {
            throw new Error(
                `Invalid description value. The 'description' field is required and must be a string.`
            );
        }
        if (data?.completed !== undefined && typeof data.completed !== 'boolean') {
            throw new Error(
                `Invalid completed value. The 'completed' field, if specified, must be a boolean.`
            );
        }
        if (data?.blocked !== undefined && typeof data.blocked !== 'boolean') {
            throw new Error(
                `Invalid blocked value. The 'blocked' field, if specified, must be a boolean.`
            );
        }
    }

    get description() {
        return this.#data.description;
    }

    isBlocked() {
        return this.#data.blocked;
    }

    isCompleted() {
        return this.#data.completed;
    }

    toggleCompleted() {
        if (this.#data.blocked) return;
        this.#data.completed = !this.#data.completed;
    }

    toggleBlocked() {
        this.#data.blocked = !this.#data.blocked;
    }
}

class TodoList {
    #tasks;

    constructor() {
        this.#tasks = [];
    }

    get count() {
        return this.#tasks.length;
    }

    get tasks() {
        return this.#tasks;
    }

    validateIndex(index) {
        if (index < 0 || index >= this.tasks.length) {
            throw new Error('Index out of bounds.');
        }
    }

    addTask(task) {
        if (!(task instanceof Task))
            throw new Error('Task must be an instance of TaskModel.');
        this.#tasks.push(task);
    }

    removeTask(index) {
        this.validateIndex(index);
        return this.#tasks.splice(index, 1);
    }

    removeAllTasks() {
        this.#tasks = [];
    }

    toggleCompletedTaskState(index) {
        this.validateIndex(index);
        this.#tasks[index].toggleCompleted();
    }

    toggleBlockedTaskState(index) {
        this.validateIndex(index);
        this.#tasks[index].toggleBlocked();
    }
}

// View
class TodoListView {
    #todoList;

    constructor() {
        this.#todoList = document.getElementById('todo-list');
    }

    render(controller) {
        const tasks = controller.getTasks();

        this.#todoList.innerHTML = '';

        const toTaskView = (taskRaw, index) => new TaskView(taskRaw, index);
        const appendToPage = (task) =>
            this.#todoList.appendChild(task.render(controller));

        tasks.map(toTaskView).forEach(appendToPage);

        return this.#todoList;
    }
}

class TaskView {
    #task;
    #index;

    constructor(task, index) {
        this.#task = task;
        this.#index = index;
    }

    render(controller) {
        const template = document.querySelector('#template-todo-item');
        const clone = template.content.cloneNode(true);

        const index = this.#index;
        const task = this.#task;

        if (task.isCompleted()) {
            clone.querySelector('.item').classList.add('checked');
        }
        clone.querySelector('.description').innerText = task.description;
        clone.querySelector('.lock').innerHTML = task.isBlocked()
            ? '<span class="material-icons md">lock</span>'
            : '<span class="material-icons md">lock_open</span>';

        clone.querySelector('.lock').addEventListener('click', (event) => {
            event.preventDefault();
            controller.toggleBlockedTaskState(index);
        });
        clone.querySelector('.item').addEventListener('click', (event) => {
            event.preventDefault();
            const eventTargetClassList = event.target.classList;

            if (
                !eventTargetClassList.contains('item') &&
                !eventTargetClassList.contains('description')
            )
                return;

            controller.toggleCompletedTaskState(index);
        });

        clone.querySelector('.close').addEventListener('click', () => {
            controller.removeTask(index);
        });

        return clone;
    }
}

// Controller
class TodoListController {
    #todoListModel;
    #todoListView;

    constructor() {
        this.#todoListModel = new TodoList();
        this.#todoListView = new TodoListView();

        if (localStorage.getItem('todo-list')) {
            const todoList = JSON.parse(localStorage.getItem('todo-list'));

            const toTaskModel = ({ description, blocked, completed }) =>
                new Task({ description, blocked, completed });

            const addTask = (task) => this.addTask(task);

            todoList.map(toTaskModel).forEach(addTask.bind(this));
        }
    }

    saveState() {
        const tasks = this.#todoListModel.tasks;

        localStorage.setItem(
            'todo-list',
            JSON.stringify(
                tasks.map((task) => ({
                    description: task.description,
                    blocked: task.isBlocked(),
                    completed: task.isCompleted(),
                }))
            )
        );
    }

    addTask(task) {
        if (!task instanceof Task) {
            throw new Error('Task must be an instance of TaskModel');
        }
        this.#todoListModel.addTask(task);
        this.saveState();
        this.renderView();
    }

    removeTask(index) {
        this.#todoListModel.validateIndex(index);
        this.#todoListModel.removeTask(index);
        this.saveState();
        this.renderView();
    }

    getTasks() {
        return this.#todoListModel.tasks;
    }

    toggleCompletedTaskState(index) {
        this.#todoListModel.validateIndex(index);
        this.#todoListModel.toggleCompletedTaskState(index);
        this.saveState();
        this.renderView();
    }

    toggleBlockedTaskState(index) {
        this.#todoListModel.toggleBlockedTaskState(index);
        this.saveState();
        this.renderView();
    }

    renderView() {
        return this.#todoListView.render(this);
    }
}
