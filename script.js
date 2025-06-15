     // Setup Event Listener for Page Load
        document.addEventListener('DOMContentLoaded', function() {
            
            // Select DOM Elements
            const addButton = document.getElementById('add-task-btn');
            const taskInput = document.getElementById('task-input');
            const taskList = document.getElementById('task-list');

            // Create the addTask Function
            function addTask() {
                // Retrieve and trim the value from the task input field
                const taskText = taskInput.value.trim();
                
                // Check if taskText is not empty
                if (taskText === "") {
                    alert("Please enter a task");
                    return;
                }

                // Task Creation and Removal
                // Create a new li element and set its textContent
                const li = document.createElement('li');
                li.textContent = taskText;

                // Create a new button element for removing the task
                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remove';
                removeButton.classList.add('remove-btn');

                // Assign an onclick event to the remove button
                removeButton.onclick = function() {
                    taskList.removeChild(li);
                };

                // Append the remove button to the li element
                li.appendChild(removeButton);
                
                // Append the li to taskList
                taskList.appendChild(li);

                // Clear the task input field
                taskInput.value = '';
            }

            // Attach Event Listeners
            // Add event listener to addButton for click event
            addButton.addEventListener('click', addTask);

            // Add event listener to taskInput for keypress event (Enter key)
            taskInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    addTask();
                }
            });
        });