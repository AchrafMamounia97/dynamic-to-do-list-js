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
                        document.getElementById('storage-info').textContent = 'Using localStorage (tasks will persist across sessions)';
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
                    addTaskToDOM(taskText);
                });
            }

            // Create task element in DOM
            function addTaskToDOM(taskText) {
                // Create a new li element
                const li = document.createElement('li');
                
                // Create a span for the task text
                const taskSpan = document.createElement('span');
                taskSpan.className = 'task-text';
                taskSpan.textContent = taskText;
                
                // Create a new button element for removing the task
                const removeButton = document.createElement('button');
                removeButton.textContent = "Remove";
                removeButton.className = 'remove-btn';

                // Assign an onclick event to the remove button
                removeButton.onclick = function() {
                    removeTask(taskText, li);
                };

                // Append the task text and remove button to the li element
                li.appendChild(taskSpan);
                li.appendChild(removeButton);

                // Append the li to taskList
                taskList.appendChild(li);
            }

            // Remove task function
            function removeTask(taskText, liElement) {
                // Remove from DOM
                taskList.removeChild(liElement);
                
                // Remove from tasks array
                const taskIndex = tasksArray.indexOf(taskText);
                if (taskIndex > -1) {
                    tasksArray.splice(taskIndex, 1);
                }
                
                // Update storage
                saveTasks(tasksArray);
            }

            // Create the addTask Function
            function addTask(taskText = null, save = true) {
                // Get task text from input or parameter
                const text = taskText || taskInput.value.trim();

                // Check if text is not empty
                if (text === "") {
                    if (!taskText) { // Only show alert if user is adding manually
                        alert("Please enter a task!");
                    }
                    return;
                }

                // Add to DOM
                addTaskToDOM(text);

                // Save to storage if requested
                if (save) {
                    tasksArray.push(text);
                    saveTasks(tasksArray);
                }

                // Clear the task input field (only if adding manually)
                if (!taskText) {
                    taskInput.value = "";
                }
            }

            // Load existing tasks when page loads
            loadTasksFromStorage();

            // Attach Event Listeners
            // Add event listener to addButton for click events
            addButton.addEventListener('click', function() {
                addTask();
            });

            // Add event listener to taskInput for keypress events (Enter key)
            taskInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    addTask();
                }
            });
        });