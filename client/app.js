const $results = $('#results')
const $welcome = $('#welcome')
// const myButton = $('#myButton')
const tasks = $('#myButton1')
const user_task = $('.user_task_btn')
const $createUserBtn = $('#new_email')
const $userInput = $('#userInput')
const $userInputSignin = $('#userInputSignin')
const $taskCard = $('.task-card')
const $incomplete = $('#not_complete')
const $complete = $('#complete')
const $NewTaskSearch = $('#NewTaskSearch')
const $taskContainer = $('.task-container')
const $beGone = $('.beGone')
const URL = 'https://task-app-by-seb.onrender.com/'

//i want to change below
$(document).ready(function () {
    $('#not_complete').hide()
    $('#complete').hide()
})
function createUser() {
    const user_email = $userInput.val()

    fetch(`${URL}newuser`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_email }),
    })
        .then((data) => {
            console.log(data.status)
            if (data.status === 400) {
                alert('Email Exists, Please Sign In')
            }
            if (data.status === 405) {
                alert('Please use a valid email')
            }
            if (data.status == 201) {
                alert('Welcome! New User Created')
            }
        })
        .catch((error) => {
            if (error.message === 'No response') {
                alert('email exists')
            }
            console.error('Error! ', error)
        })
}
$userInput.on('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault()
        createUser()
    }
})

$createUserBtn.on('click', () => {
    createUser()
})

//matches email/user name to the task table

function signin() {
    const userInput = $userInputSignin.val()
    fetch(`${URL}users/${userInput}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data)

            if (data === 'USER NOT FOUND' || data === 0 || data === undefined) {
                alert('USER NOT FOUND!!!')
            } else {
                // console.log(data);
                $beGone.remove()
                $welcome.empty()

                let email = data['user_email']
                const welcomeCard = $('<h1></h1>')
                    .attr('class', 'welcome-card')
                    .attr('id', `${data['user_id']}`)
                    .text(` Welcome, ${email} `)
                $welcome.append(welcomeCard)

                displayTasks()
            }
        })
        .catch((error) => {
            // console.error("Error:", error);

            console.error('error', error)

            // alert("USER NOT FOUND!!!");
        })
}

// myButton.on('click', () => {
//     signin()
// })
$userInputSignin.on('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault()
        signin()
    }
})
// what happens after you sign in then populate all the tasks to that user

function displayTasks() {
    const userId = $('.welcome-card').attr('id')
    fetch(`${URL}tasks/${userId}`)
        .then((response) => response.json())
        .then((data) => {
            $('#not_complete').show()
            $('#complete').show()
            $results.empty()
            $incomplete.empty()
            $complete.empty()
            $NewTaskSearch.empty()
            for (let task of data) {
                let tasks = task['todo']
                const taskCard = $('<div></div>').attr('class', 'task-card')
                if (task.completed === false) {
                    taskCard.text(`${tasks} `)
                    const deleteBtn = $('<button>x</i></button>')
                        .attr('data-task-id', task.task_id)
                        .attr('class', 'delete_task')
                    const container = $('<div></div>').attr(
                        'class',
                        'task-container'
                    )
                    const completedBtn = $('<button>To-Do</i></button>')
                        .attr('data-task-id', task.task_id)
                        .attr('id', task.user_id)
                        .attr('data-task-complete', task.completed)
                        .attr('class', 'incomplete_task')
                    taskCard.prepend(completedBtn)
                    taskCard.prepend(deleteBtn)
                    container.append(taskCard)
                    $incomplete.append(container)
                    $results.append($incomplete)
                } else {
                    taskCard.text(`${tasks}  `)
                    const completedBtn = $('<button>Done</i></button>')
                        .attr('data-task-id', task.task_id)
                        .attr('id', task.user_id)
                        .attr('data-task-complete', task.completed)
                        .attr('class', 'completed_task')
                    const deleteBtn = $('<button>x</i></button>')
                        .attr('data-task-id', task.task_id)
                        .attr('class', 'delete_task')
                    const container = $('<div></div>').attr(
                        'class',
                        'task-container'
                    )
                    taskCard.prepend(completedBtn)
                    taskCard.prepend(deleteBtn)
                    container.append(taskCard)
                    $complete.append(container)
                    $results.append($complete)
                }
            }
            //WILL NEED TO APPEND A 'INSERT NEW TASK HERE'
            const newDivForTodo = document.createElement('div')
            newDivForTodo.className = 'TodoInputDiv'
            const newTodoForm = document.createElement('form')
            newTodoForm.className = 'newTodo'
            const textTodo = document.createElement('input')
            textTodo.name = 'text'
            textTodo.set = textTodo.text
            textTodo.setAttribute('placeholder', 'Type New Task')
            textTodo.setAttribute('class', 'newTodoText')
            textTodo.setAttribute('id', `${userId}`)

            newTodoForm.append(textTodo)
            newDivForTodo.append(newTodoForm)
            $NewTaskSearch.append(newDivForTodo)
        })
        .catch((error) => {
            console.error('Error:', error)
        })
}
// $results.on("submit", "form", (event) => {
//   event.preventDefault();
//   newTask();
// });

function newTask() {
    const newTaskUser = $('.newTodoText').attr('id')
    const newTaskInput = $('.newTodoText').val()
    console.log(newTaskInput)
    fetch(`${URL}newtask/${newTaskUser}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newTaskInput }),
    })
        .then((response) => response.json())
        .then((data) => {
            let tasks = data['todo']
            console.log(tasks)
            const taskCard = $('<div></div>').attr('class', 'task-card')
            taskCard.text(`${tasks}`)
            const deleteBtn = $('<button>x</i></button>')
                .attr('data-task-id', `${data['task_id']}`)
                .attr('class', 'delete_task')
            const container = $('<div></div>').attr('class', 'task-container')
            const completedBtn = $('<button>To-Do</i></button>')
                .attr('data-task-id', data['task_id'])
                .attr('id', data['user_id'])
                .attr('data-task-complete', data['completed'])
                .attr('class', 'completed_task')
            taskCard.prepend(completedBtn)
            taskCard.append(deleteBtn)
            container.append(taskCard)
            $incomplete.append(container)
            $results.append($incomplete)
        })
        .catch((error) => {
            console.error('error', error)
        })
}
$NewTaskSearch.on('keypress', '.newTodoText', (event) => {
    const $newTodoText = $('.newTodoText')

    if (event.key === 'Enter') {
        event.preventDefault()
        if ($newTodoText.val() === '') {
            alert('Please enter a task')
        } else {
            newTask()
        }
        $newTodoText.val('')
    }
})

//need a function to switch the true/false statements to the correct div
$results.on('click', '.incomplete_task', completedOrNah)
$results.on('click', '.completed_task', completedOrNah)
function completedOrNah(event) {
    console.log($(event.target).data('task-id'))
    console.log($(event.target).attr('id'))
    console.log($(event.target).data('task-complete'))
    const userId = $(event.target).attr('id')
    const taskId = $(event.target).data('task-id')
    const completed = $(event.target).data('task-complete')
    fetch(`/tasks/${userId}/${taskId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed: completed }),
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Task change failed.')
            }
            return response.json()
        })
        .then((data) => {
            console.log(data)
            const taskCardUpdate = event.target.closest('.task-container')
            taskCardUpdate.remove()
            if (data['completed'] === false) {
                let tasks = data['todo']
                const taskCard = $('<div></div>').attr('class', 'task-card')
                taskCard.text(`${tasks}`)
                const deleteBtn = $('<button>x</i></button>')
                    .attr('data-task-id', `${data['task_id']}`)
                    .attr('class', 'delete_task')
                const container = $('<div></div>').attr(
                    'class',
                    'task-container'
                )
                const completedBtn = $('<button>To-Do</i></button>')
                    .attr('data-task-id', data['task_id'])
                    .attr('id', data['user_id'])
                    .attr('data-task-complete', false)
                    .attr('class', 'incomplete_task')
                taskCard.prepend(completedBtn)
                // $taskContainer.append(completed)
                taskCard.prepend(deleteBtn)
                container.append(taskCard)
                $incomplete.append(container)
                $results.append($incomplete)
            } else {
                let tasks = data['todo']
                const taskCard = $('<div></div>').attr('class', 'task-card')
                taskCard.text(`${tasks}`)
                const deleteBtn = $('<button>x</i></button>')
                    .attr('data-task-id', `${data['task_id']}`)
                    .attr('class', 'delete_task')
                const container = $('<div></div>').attr(
                    'class',
                    'task-container'
                )
                const completedBtn = $('<button>Done</i></button>')
                    .attr('data-task-id', data['task_id'])
                    .attr('id', data['user_id'])
                    .attr('data-task-complete', true)
                    .attr('class', 'completed_task')
                taskCard.prepend(completedBtn)
                taskCard.prepend(deleteBtn)
                container.append(taskCard)
                $complete.append(container)
                $results.append($complete)
            }
        })
        .catch((error) => {
            console.error(error)
        })
}

// delete button specific to the user
$results.on('click', '.delete_task', deleteTask)
function deleteTask(event) {
    const taskId = $(event.target).data('task-id')

    if (confirm('Are you sure you want to delete this task?')) {
        fetch(`${URL}tasks/${taskId}`, { method: 'DELETE' })
            .then((response) => response.json())
            .then((data) => {
                alert('Task deleted!')
                const taskCard = event.target.closest('.task-container')
                taskCard.remove()
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    }
}
// Create the "complete" div
// const $complete = $('<div></div>').attr('id', 'complete')
// $results.append($complete)
// const userId = $('.welcome-card').attr('id')
//will use in future patches
// const $incomplete = $('<div></div>').attr('id', 'not_complete')
// $results.append($incomplete)
