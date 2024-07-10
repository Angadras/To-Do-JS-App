import ToDoList from "./todolist.js";
import ToDoItem from "./todoitem.js";

const toDoList = new ToDoList();

// Launch App
document.addEventListener("readystatechange", (event) => {
    if (event.target.readyState === "complete") {
        initApp();
    }
});

const initApp = () => {
    // Add listeners
    const itemEntryForm = document.getElementById("item-entry-form");
    if (itemEntryForm) {
        itemEntryForm.addEventListener("submit", (event) => {
            event.preventDefault();
            processTheSubmission();
        });
    }

    const clearItems = document.getElementById("clear-items");
    if (clearItems) {
        clearItems.addEventListener("click", (event) => {
            const list = toDoList.getList();
            if (list.length) {
                const confirmed = confirm("Tem certeza que você quer apagar a lista toda?");
                if (confirmed) {
                    toDoList.clearList();
                    updateConsistentData(toDoList.getList());
                    refreshThePage();
                }
            }
        });
    }

    // Procedural
    loadListObject();
    refreshThePage();
};

const loadListObject = () => {
    const storedList = localStorage.getItem("listaDeTarefas");
    if (typeof storedList !== "string") return;
    const parsedList = JSON.parse(storedList);
    parsedList.forEach(itemObj => {
        const newToDoItem = createNewItem(itemObj._id, itemObj._item);
        toDoList.addItemToList(newToDoItem);
    });
};

const refreshThePage = () => {
    clearListDisplay();
    renderList();
    clearItemEntryField();
    setFocusOnItemEntry();
};

const clearListDisplay = () => {
    const parentElement = document.getElementById("list-items");
    deleteContents(parentElement);
};

const deleteContents = (parentElement) => {
    let child = parentElement.lastElementChild;
    while (child) {
        parentElement.removeChild(child);
        child = parentElement.lastElementChild;
    }
};

const renderList = () => {
    const list = toDoList.getList();
    list.forEach(item => {
        buildListItem(item);
    });
};

const buildListItem = (item) => {
    const div = document.createElement("div");
    div.className = "item";
    const check = document.createElement("input");
    check.type = "checkbox";
    check.id = item.getId();
    check.tabIndex = 0;
    addClickListenerToCheckbox(check);
    const label = document.createElement("label");
    label.htmlFor = item.getId();
    label.textContent = item.getItem();
    div.appendChild(check);
    div.appendChild(label);
    const container = document.getElementById("list-items");
    container.appendChild(div);
};

const addClickListenerToCheckbox = (check) => {
    check.addEventListener("click", (event) => {
        toDoList.deleteItemFromList(check.id);
        updateConsistentData(toDoList.getList());
        setTimeout(() => {
            refreshThePage();
        }, 1500);                                                                             // 1000ms = 1 second
    });
};

const updateConsistentData = (listArray) => {
    localStorage.setItem("listaDeTarefas", JSON.stringify(listArray));
};

const clearItemEntryField = () => {
    document.getElementById("new-item").value = "";
};

const setFocusOnItemEntry = () => {
    document.getElementById("new-item").focus();
};

const processTheSubmission = () => {
    const newEntryText = getNewEntry();
    if (!newEntryText.length) return;
    const nextItemId = calcNextItemId();
    const toDoItem = createNewItem(nextItemId, newEntryText);
    toDoList.addItemToList(toDoItem);
    updateConsistentData(toDoList.getList());
    refreshThePage();
};

const getNewEntry = () => {
    return document.getElementById("new-item").value.trim();
};

const calcNextItemId = () => {
    let nextItemId = 1;
    const list = toDoList.getList();
    if (list.length > 0) {
        nextItemId = list[list.length - 1].getId() + 1;
    }
    return nextItemId;
};

const createNewItem = (itemId, itemText) => {
    const toDo = new ToDoItem();
    toDo.setId(itemId);
    toDo.setItem(itemText);
    return toDo;
};
