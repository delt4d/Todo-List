const controller = new TodoListController();

controller.renderView();

document.getElementById('add-task-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const description = event.target.elements.description.value;
    const task = new Task({ description });

    event.target.elements.description.value = '';

    controller.addTask(task);
    controller.renderView();
});
