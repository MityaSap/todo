(function () {
  function createAppTitle(title) {
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }

  function createTodoItemForm() {
    let form = document.createElement("form");
    let input = document.createElement("input");
    let buttonWrapper = document.createElement("div");
    let button = document.createElement("button");

    form.classList.add("input-group", "mb-3");
    input.classList.add("form-control");
    input.placeholder = "Введите ваше название нового отдела";
    buttonWrapper.classList.add("input-group-append");
    button.classList.add("btn", "btn-primary");
    button.textContent = "Добавить дело";
    button.disabled = true;

    buttonWrapper.append(button);
    form.append(input, buttonWrapper);

    input.addEventListener("input", function () {
      button.disabled = input.value.trim() === "";
    });

    return { form, input, button };
  }

  function createTodoList() {
    let list = document.createElement("ul");
    list.classList.add("list-group");
    return list;
  }

  function createTodoItem(name, done) {
    let item = document.createElement("li");
    let buttonGroup = document.createElement("div");
    let doneButton = document.createElement("button");
    let deleteButton = document.createElement("button");

    item.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    item.textContent = name;
    if (done) {
      item.classList.toggle("list-group-item-success");
    }

  

    buttonGroup.classList.add("btn-group", "btn-group-sm");
    doneButton.classList.add("btn", "btn-success");
    doneButton.textContent = "Готово";
    deleteButton.classList.add("btn", "btn-danger");
    deleteButton.textContent = "Удалить";

    buttonGroup.append(doneButton, deleteButton);
    item.append(buttonGroup);

    return { item, doneButton, deleteButton };
  }

  function addButtonEventListeners(todoItem, todoArray, todoElement, listName) {
    function toggleDone() {
      todoItem.item.classList.toggle("list-group-item-success");
      let index = todoArray.findIndex(element => element.id === todoElement.id);
      if (index !== -1) {
        todoArray[index].done = !todoArray[index].done;
        saveDataToLocalStorage(listName, todoArray);
      }
    }

    function deleteItem() {
      if (confirm("Вы уверены?")) {
        todoItem.item.remove();
        let index = todoArray.findIndex(element => element.id === todoElement.id);
        if (index !== -1) {
          todoArray.splice(index, 1);
          saveDataToLocalStorage(listName, todoArray);
        }
      }
    }

    todoItem.doneButton.addEventListener("click", toggleDone);
    todoItem.deleteButton.addEventListener("click", deleteItem);
  }

  function createTodoApp(container, title = "Список дел", listName) {
    let todoArray = getDataFromLocalStorage(listName) || [];
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    // Проверяем, есть ли данные в localStorage
    let storedData = localStorage.getItem(listName);
    if (storedData) {
      todoArray = JSON.parse(storedData);
      todoArray.forEach((item) => {
        let todoItem = createTodoItem(item.name, item.done);
        todoList.append(todoItem.item);
        addButtonEventListeners(todoItem, todoArray, item, listName);
      });
    }

    container.append(todoAppTitle, todoItemForm.form, todoList);

    function idForElement() {
      return todoArray.length ? todoArray[todoArray.length - 1].id + 1 : 1;
    }

    todoItemForm.form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!todoItemForm.input.value) return;

      let todoElement = {
        id: idForElement(),
        name: todoItemForm.input.value,
        done: false,
      };

      todoArray.push(todoElement);
      let todoItem = createTodoItem(todoElement.name);
      addButtonEventListeners(todoItem, todoArray, todoElement, listName);

      saveDataToLocalStorage(listName, todoArray);
      todoList.append(todoItem.item);
      todoItemForm.input.value = "";
      todoItemForm.button.disabled = true;
    });
  }

  function saveDataToLocalStorage(key, data) {
    const jsonData = JSON.stringify(data);
    localStorage.setItem(key, jsonData);
  }

  function getDataFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  window.createTodoApp = createTodoApp;
})();
