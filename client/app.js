const $results = $('#results')
const $welcome = $('#welcome')
const myButton = $('#myButton')
const tasks = $('#myButton1')
const user_task = $('.user_task_btn')
const $createUserBtn = $('#new_email')
const $userInput = $('#userInput')
const $userInputSignin = $('#userInputSignin')
const $taskCard = $('.task-card')
const $incomplete = $('#not_complete')
const $complete = $('#complete')
const $NewTaskSearch = $('#NewTaskSearch')
const URL = 'https://task-app-by-seb.onrender.com/'
$results.on('click', '.delete_task', deleteTask)

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
            // taskBtn.empty();
            if (data === 'USER NOT FOUND' || data === 0 || data === undefined) {
                alert('USER NOT FOUND!!!')
            } else {
                // console.log(data);
                $welcome.empty()

                let email = data['user_email']
                const welcomeCard = $('<h2></h2>')
                    .attr('class', 'welcome-card')
                    .text(` Welcome, ${email} `)
                const taskBtn = $('<button>CHECK YOUR TASKS</button>')
                    .attr('id', `${data['user_id']}`)
                    .attr('class', 'user_task_btn')
                $results.find('.user_task_btn').remove()
                $welcome.append(welcomeCard)
                $results.append(taskBtn)
            }
        })
        .catch((error) => {
            // console.error("Error:", error);

            console.error('error', error)

            // alert("USER NOT FOUND!!!");
        })
}

myButton.on('click', () => {
    signin()
})
$userInputSignin.on('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault()
        signin()
    }
})

$results.on('click', '.user_task_btn', () => {
    const userId = $('.user_task_btn').attr('id')
    fetch(`${URL}tasks/${userId}`)
        .then((response) => response.json())
        .then((data) => {
            $results.empty()
            for (let task of data) {
                let tasks = task['todo']
                const taskCard = $('<div></div>').attr('class', 'task-card')
                if (task.completed === false) {
                    taskCard.text(`${tasks} ⭕ `)
                    const deleteBtn = $('<button>x</i></button>')
                        .attr('data-task-id', task.task_id)
                        .attr('class', 'delete_task')
                    const container = $('<div></div>').attr(
                        'class',
                        'task-container'
                    )

                    taskCard.append(deleteBtn)
                    container.append(taskCard)
                    $incomplete.append(container)
                    $results.append($incomplete)
                } else {
                    taskCard.text(`${tasks} ✅ `)
                    const deleteBtn = $('<button>x</i></button>')
                        .attr('data-task-id', task.task_id)
                        .attr('class', 'delete_task')
                    const container = $('<div></div>').attr(
                        'class',
                        'task-container'
                    )

                    taskCard.append(deleteBtn)
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
})
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
            taskCard.text(`${tasks} ⭕ `)
            const deleteBtn = $('<button>x</i></button>')
                .attr('data-task-id', `${data['task_id']}`)
                .attr('class', 'delete_task')
            const container = $('<div></div>').attr('class', 'task-container')

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
console.log('hello')
// delete button specific to the user
function deleteTask(event) {
    const taskId = $(event.target).data('task-id')

    if (confirm('Are you sure you want to delete this task?')) {
        fetch(`/tasks/${taskId}`, { method: 'DELETE' })
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

//create new post for the specific user

//------------------------------------------------------------------------
// //GET ALL TASKS
// tasks.on("click", () => {
//   // console.log("hello");

//   // const userInput = prompt("type your email:");
//   fetch(`/tasks`)
//     .then((response) => response.json())
//     .then((data) => {
//       $results.empty();
//       for (let tasks of data) {
//         // console.log(tasks);
//         console.log(tasks.completed);
//         if (tasks.completed === false) {
//           const taskCard = $("<h2></h2>")
//             .attr("class", "task-card")
//             .text(`${tasks.todo} GET TO WORK`);
//           $results.append(taskCard);
//         } else {
//           const taskCard = $("<h2></h2>")
//             .attr("class", "task-card")
//             .text(`${tasks.todo} COMPLETED`);
//           $results.append(taskCard);
//         }
//       }
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// });
