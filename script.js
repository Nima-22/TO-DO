
// Get elements
const popup = document.getElementById("popup");
const addBtn = document.querySelector(".add-btn");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");

// Get existing tasks on page load
window.addEventListener("DOMContentLoaded", loadTasks);

// Show popup
addBtn.addEventListener("click", () => {
    popup.style.display = "flex";

    // Re-trigger popup animation
    const popupBox = document.querySelector(".popup-content");
    popupBox.classList.remove("popup-animate");
    void popupBox.offsetWidth; // Force reflow
    popupBox.classList.add("popup-animate");

    taskInput.focus();
});


// Add task from popup
addTaskBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
        const task = { text: taskText, completed: false };
        addTaskToPage(task);
        saveTaskToLocal(task);
        taskInput.value = "";
        popup.style.display = "none";
    }
});

// 🔄 Save to localStorage
function saveTaskToLocal(task) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(task);
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// 🧱 Load tasks from localStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach((task) => addTaskToPage(task));
}

// 🧹 Update localStorage after delete or check
function updateLocalStorage() {
    const allTasks = document.querySelectorAll(".todo-item");
    const tasksToSave = [];

    allTasks.forEach((item) => {
        const text = item.querySelector("label").innerText.trim();
        const completed = item.classList.contains("completed");
        tasksToSave.push({ text, completed });
    });

    localStorage.setItem("tasks", JSON.stringify(tasksToSave));
}

// ✅ Create task element and attach to page
function addTaskToPage(task) {
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("todo-item");
    if (task.completed) taskDiv.classList.add("completed");

    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    const taskText = document.createTextNode(" " + task.text);

    const deleteBtn = document.createElement("span");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = "🗑️";

    // ✅ Checkbox event
    checkbox.addEventListener("change", () => {
        taskDiv.classList.toggle("completed");
        updateLocalStorage();
    });

    // 🗑️ Delete button
    deleteBtn.addEventListener("click", () => {
        // Smooth fade-out before delete
        taskDiv.classList.add("fade-out");
        setTimeout(() => {
            taskDiv.remove();
            updateLocalStorage();
        }, 300);

        updateLocalStorage();
    });

    label.appendChild(checkbox);
    label.appendChild(taskText);
    taskDiv.appendChild(label);
    taskDiv.appendChild(deleteBtn);
    document.body.appendChild(taskDiv);
}
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(reg => console.log("Service Worker Registered!"));
}
