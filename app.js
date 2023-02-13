let $ = document.querySelector.bind(document)
let $$ = document.querySelectorAll.bind(document)

const taskInput = $('.taskInput input')
const listItems = $('.listItems')
const filters = $$('.filters span')
const clearAll = $('.btnClear')

let updateTaskID;
let isUpdateTask = false;

let todoList = JSON.parse(localStorage.getItem('todoList')) // setup database

filters.forEach(btn => {
    btn.addEventListener('click', () => {
        $('span.active').classList.remove('active')
        btn.classList.add('active')
        showTodo(btn.id)
    })
})

// hàm showTodo
function showTodo(filter) {
    let li = '';
    if (todoList) { //check todoList isn't empty ?
        todoList.forEach((todo, id) => {
            let isCompleted = todo.status == 'completed' ? "checked" : "" ;
            if (filter == todo.status || filter == 'all') {
                li += `<li class="listItem">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                                <p class= "${isCompleted}">${todo.name}</p>
                            </label>
                            <div class="setting">
                                <i onclick="showSetting(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="settingList">
                                    <li onclick="updateTask(${id}, '${todo.name}')" class="settingItem"><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick="deleteTask(${id})" class="settingItem"><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </li>
                `;
            }
        });
    }
    listItems.innerHTML = li || `<span>No Tasks Here</span>`;
}

// Update the status
function updateStatus(selectTask) {
    let taskName = selectTask.parentElement.lastElementChild
    if(selectTask.checked) {
        taskName.classList.add('checked')
        todoList[selectTask.id].status = 'completed'
    } else {
        taskName.classList.remove('checked')
        todoList[selectTask.id].status = 'pending'
    }
    localStorage.setItem('todoList', JSON.stringify(todoList));
}

// Update Task
function updateTask(selectTaskID, selectTaskName) {
    updateTaskID = selectTaskID
    isUpdateTask = true
    taskInput.value = selectTaskName
}

// Delete Task
function deleteTask(selectTask) { 
    todoList.splice(selectTask, 1)
    localStorage.setItem('todoList', JSON.stringify(todoList));
    showTodo();
}

// Clear All Tasks
clearAll.addEventListener('click', function() {
    todoList.splice(0, todoList.length)
    localStorage.setItem('todoList', JSON.stringify(todoList));
    showTodo();
})

// showSetting
function showSetting(selectTask) {
    // tạo hover fake
    let settingList = selectTask.parentElement.lastElementChild
    settingList.classList.add('show')
    // xóa hover fake
    document.addEventListener("click", function (e) {
        if (e.target.tagName != "I" || e.target != selectTask) {
            settingList.classList.remove('show')
        }
    })
}


taskInput.addEventListener('keyup', function(e) {
    let userTask = taskInput.value.trim();
    if(e.key == "Enter" && userTask) {
        if (!isUpdateTask) {
            if (!todoList) { // check todoList isn't exist ?
                todoList = []
            }
            let taskInfo = {name: userTask, status:'pending'}
            todoList.push(taskInfo); // add to list
        } else {
            isUpdateTask = false
            todoList[updateTaskID].name = userTask
        }
        taskInput.value = ''
        localStorage.setItem('todoList', JSON.stringify(todoList));
        showTodo('all');
    }
})
showTodo('all');
