// In-memory storage as fallback
let tasksArray = [];

// Storage utility functions
function isLocalStorageAvailable() {
    try {
        const test = '__localStorage_test__';
        localStorage.setItem(test, test);
        localStorage.removeItem(test);
        return true;
    } catch (e) {
        return false;
    }
}

function saveTasks(tasks) {
    if (isLocalStorageAvailable()) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    tasksArray = [...tasks]; // Keep in-memory copy
}

function loadTasks() {
    let storedTasks = [];
    
    if (isLocalStorageAvailable()) {
        const stored = localStorage.getItem('tasks');
        if (stored) {
            try {
                storedTasks = JSON.parse(stored);
            } catch (e) {
                console.warn('Failed to parse stored tasks:', e);
                storedTasks = [];
            }
        }
    }
    
    tasksArray = storedTasks;
    return storedTasks;
}

// Setup Event Listener for Page Load
document.addEventListener('DOMContentLoaded', function() {
    // Select DOM Elements
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Load tasks from storage when page loads
    function loadTasksFromStorage() {
        const storedTasks = loadTasks();
        storedTasks.forEach(taskText => {
            addTask(taskText, false); // false indicates not to save again to Local Storage
        });
    }

    // Create the addTask Function
    function addTask(taskText, save = true) {
        let text;
        
        // Handle both parameter and input field cases
        if (typeof taskText === 'string') {
            text = taskText.trim();
        } else {
            // Retrieve and trim the value from the task input field
            text = taskInput.value.trim();
        }
        
        // Check if taskText is not empty
        if (text === "") {
            if (typeof taskText !== 'string') { // Only show alert if user is adding manually
                alert("Please enter a task!");
            }
            return;
        }

        // Task Creation and Removal
        // Create a new li element and set its textContent
        const li = document.createElement('li');
        li.textContent = text;

        // Create a new button element for removing the task
        const removeButton = document.createElement('button');
        removeButton.textContent = "Remove";
        removeButton.className = 'remove-btn';

        // Assign an onclick event to the remove button
        removeButton.onclick = function() {
            // Remove from DOM
            taskList.removeChild(li);
            
            // Remove from tasks array
            const taskIndex = tasksArray.indexOf(text);
            if (taskIndex > -1) {
                tasksArray.splice(taskIndex, 1);
            }
            
            // Update storage
            saveTasks(tasksArray);
        };

        // Append the remove button to the li element
        li.appendChild(removeButton);

        // Append the li to taskList
        taskList.appendChild(li);

        // Save to storage if requested
        if (save) {
            tasksArray.push(text);
            saveTasks(tasksArray);
        }

        // Clear the task input field (only if adding manually)
        if (typeof taskText !== 'string') {
            taskInput.value = "";
        }
    }

    // Load existing tasks when page loads
    loadTasksFromStorage();

    // Attach Event Listeners
    // Add event listener to addButton for click events
    addButton.addEventListener('click', addTask);

    // Add event listener to taskInput for keypress events (Enter key)
    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });
});