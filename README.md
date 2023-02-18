# DELT4D TO-DO LIST

https://delt4d.github.io/Todo-List/

Todo list feito em HTML, CSS e JS utilizando uma arquitetura o mais próxima do MVC que o Front-End permite.

![Page image](/demo/page.png "Text to show on mouseover")

## Implementação

O site conta com um HTML simples com um formulário contendo um input da descrição da tarefa e um botão que adiciona a tarefa,
uma div com id #todo-list onde a lista de tarefas são renderizadas e um <template #template-todo-item> que é utilizado como
estrutura do html da tarefa para evitar criar todos os elementos no javascript.

No arquivo 'index.js', temos um código que instância o 'TodoListController' e logo após executa 'controller.renderView()' que vai
obter os dados do localstorage, caso aja, e mostrar a lista de tarefas no página. Depois disso, é adicionado um evento de 'submit'
no formulário onde é pego a descrição da tarefa, criado uma tarefa (instância da classe Task), e adicionado à lista de tarefas
através do método do controller 'controller.addTask(task)'. Logo em seguida é executado 'controller.renderView()' para atualizar
a lista de tarefas na página.

Em 'todo.js' temos a implementação dos models, views e do controller. No model Task, temos uma classe com os atributos 'description',
'completed' e 'blocked' que são passados via construtor e validados. Esta classe também implementa alguns métodos como 'isCompleted()',
'isBlocked()', 'toggleCompleted()' e 'toggleBlocked()'. Temos também o model TodoList, que é uma classe que contém uma lista de Tasks
e implementa métodos para adição, remoção e alteração dos estado das Tasks. Como views temos 'TaskView' que recebe uma task e um indíce
(o índice da Task no Model 'TodoList') e 'TodoListView' que é responsável por atualizar a página com a lista de tarefas. Cada view tem
um método render que gera o html e pode ou não atualizar a página. Como controller temos a classe 'TodoListController', que instância
o model 'TodoList' e a view 'TodoListView' e implementa vários métodos para gerenciar toda a aplicação (métodos de adição e remoção de tarefas,
salvamento dos dados no localstorage, renderização da view e alteração do estado de uma task específica).

## Funcionalidades

-   Adicionar tarefas
-   Remover tarefas
-   Completar tarefas
-   Bloquear a seleção de tarefas
-   Salvar as alterações no localstorage

## 🛠 Habilidades

Básico Javascript, HTML, CSS.

## Licença

[MIT](https://choosealicense.com/licenses/mit/)
