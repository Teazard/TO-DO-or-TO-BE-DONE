document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    let taskInput = document.getElementById("taskInput");
    let taskText = taskInput.value.trim();
    if (taskText) {
        createTaskElement(taskText, "todoList");
        saveTasks();
        taskInput.value = "";
    }
}

function createTaskElement(text, listId) {
    let li = document.createElement("li");
    li.innerHTML = `${text} 
        <span class="icon" onclick="moveTask(this, 'doneList')">✅</span>
        <span class="icon" onclick="moveTask(this, 'tobedoneList')">⏳</span>
        <span class="icon" onclick="moveTask(this, 'cancelList')">🗑️</span>`;
    document.getElementById(listId).appendChild(li);
}
document.getElementById("taskInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});


function moveTask(element, targetList) {
    let taskText = element.parentElement.innerText.replace(/✅|⏳|🗑️|🔼/g, "").trim();
    let newList = document.getElementById(targetList);
    let li = document.createElement("li");

    if (targetList === "todoList") {
        li.innerHTML = `${taskText} 
            <span class="icon" onclick="moveTask(this, 'doneList')">✅</span>
            <span class="icon" onclick="moveTask(this, 'tobedoneList')">⏳</span>
            <span class="icon" onclick="moveTask(this, 'cancelList')">🗑️</span>`;
    } else {
        li.innerHTML = `${taskText} 
            <span class="icon" onclick="moveTask(this, 'todoList')">🔼</span>`;
    }

    newList.appendChild(li);
    element.parentElement.remove();
    saveTasks();
}


function saveTasks() {
    let lists = ["todoList", "tobedoneList", "doneList", "cancelList"];
    let tasks = {};
    lists.forEach(list => {
        tasks[list] = Array.from(document.getElementById(list).children).map(li => li.innerText.replace(/✅|⏳|🗑️|🔼/g, "").trim());
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || {todoList: [], tobedoneList: [], doneList: [], cancelList: []};

    Object.keys(tasks).forEach(list => {
        tasks[list].forEach(task => {
            let li = document.createElement("li");
            if (list === "todoList") {
                li.innerHTML = `${task} 
                    <span class="icon" onclick="moveTask(this, 'doneList')">✅</span>
                    <span class="icon" onclick="moveTask(this, 'tobedoneList')">⏳</span>
                    <span class="icon" onclick="moveTask(this, 'cancelList')">🗑️</span>`;
            } else {
                li.innerHTML = `${task} 
                    <span class="icon" onclick="moveTask(this, 'todoList')">🔼</span>`;
            }
            document.getElementById(list).appendChild(li);
        });
    });
}



document.getElementById("resetButton").addEventListener("click", function() {
    if (confirm("Êtes-vous sûr de vouloir tout réinitialiser ?")) {
        localStorage.clear();
        document.querySelectorAll("ul").forEach(list => list.innerHTML = ""); // Vide les listes
    }
});



// Réinitialisation automatique à minuit
function resetDailyTasks() {
    let now = new Date();
    let millisUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0) - now;

    setTimeout(() => {
        let todoList = JSON.parse(localStorage.getItem("tasks")).tobedoneList || [];
        localStorage.setItem("tasks", JSON.stringify({ todoList, tobedoneList: [], doneList: [], cancelList: [] }));
        document.getElementById("tobedoneList").innerHTML = "";
        document.getElementById("doneList").innerHTML = "";
        document.getElementById("cancelList").innerHTML = "";
        todoList.forEach(task => createTaskElement(task, "todoList"));
        resetDailyTasks();
    }, millisUntilMidnight);
}

resetDailyTasks();
