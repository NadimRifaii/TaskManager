const addTaskInput = document.querySelector('.add-task-input')
const searchTaskInput = document.querySelector('.search-task-input')
const tasksContainer = document.querySelector('.tasks-container');
const addTaskBtn = document.querySelector('button.add-btn');
const updateTaskBtn = document.querySelector('button.update-btn');
const selectFilterBy = document.querySelector('select')
let tasks = []
if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'))
  displayAllTasks(tasks)
}
let tasksCounter = tasks.length
function addTask() {
  const taskTitle = addTaskInput.value;
  if (!taskTitle || checkIfTaskExists(taskTitle) >= 0) {
    return
  }
  const task = {
    id: tasksCounter,
    title: taskTitle,
    status: 'unchecked'
  }
  tasks.push(task)
  tasksCounter++;
  localStorage.setItem('tasks', JSON.stringify(tasks))
  addTaskInput.value = null
  displayTask(task)
}
function checkIfTaskExists(title) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].title.toLowerCase() == title.toLowerCase())
      return i
  }
  return -1
}
function filterTasks(option) {
  const searchedTasks = []
  if (tasks.length == 0)
    return
  for (let task of tasks) {
    if (option == 'search') {
      if (selectFilterBy.value != 'all') {
        if (selectFilterBy.value == task.status && task.title.toLowerCase().includes(searchTaskInput.value.toLowerCase()))
          searchedTasks.push(task)
      } else if (task.title.toLowerCase().includes(searchTaskInput.value.toLowerCase()))
        searchedTasks.push(task)
    } else {
      if (task.status == option)
        searchedTasks.push(task)
    }
  }
  tasksContainer.innerHTML = ''
  if (searchedTasks.length == 0 && option == 'all') {
    displayAllTasks(tasks)
  } else if (searchedTasks.length == 0 && (option == 'checked' || option == 'unchecked')) {
    displayTask({ id: -1, title: `No ${option} tasks` }, false)
  } else if (searchedTasks.length == 0 && option == 'search') {
    displayTask({ id: -1, title: `No such task` }, false)
  } else {
    displayAllTasks(searchedTasks, false)
  }
}
function findTaskInTasksContainer(title) {
  for (let i = 0; i < tasksContainer.children.length; i++) {
    if (tasksContainer.children[i].querySelector('.task-title').innerText == title)
      return tasksContainer.children[i]
  }
  return -1
}
function deleteTask(taskId) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == taskId) {
      const currentTask = findTaskInTasksContainer(tasks[i].title)
      const removedTask = tasks.splice(i, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      if (currentTask.classList.contains('current')) {
        toggleOnUpdate(currentTask)
        addTaskInput.value = null
      }
      currentTask.remove()
      return removedTask
    }
  }
}
function toggleTaskStatus(taskId) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == taskId) {
      const task = findTaskInTasksContainer(tasks[i].title)
      task.classList.toggle('checked')
      if (task.classList.contains('checked')) {
        tasks[i].status = 'checked'
      } else {
        tasks[i].status = 'unchecked'
      }
      localStorage.setItem('tasks', JSON.stringify(tasks))
      return
    }
  }
}
function toggleOnUpdate(task) {
  updateTaskBtn.classList.toggle('hide')
  addTaskBtn.classList.toggle('hide')
  document.querySelector('.info').classList.toggle('updating')
  task.classList.toggle('current')
}
function showUpdateBtnAngToggle(taskId) {
  if (document.querySelector('.info').classList.contains('updating')) {
    return
  }
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == taskId) {
      const task = findTaskInTasksContainer(tasks[i].title)
      addTaskInput.value = task.querySelector('.task-title').innerText
      toggleOnUpdate(task)
      return
    }
  }
}
function updateTask() {
  if (!addTaskInput.value) {
    return
  }
  const currentTask = document.querySelector('.task.current .task-title')
  const index = checkIfTaskExists(currentTask.innerText)
  currentTask.innerText = addTaskInput.value
  tasks[index].title = currentTask.innerText;
  addTaskInput.value = null
  toggleOnUpdate(currentTask.parentElement)
  localStorage.setItem('tasks', JSON.stringify(tasks))
}
function doElement(value = null, element, ...classesToAdd) {
  const htmlElement = document.createElement(element)
  htmlElement.innerText = value
  addClassesToElement(htmlElement, ...classesToAdd)
  return htmlElement
}
function addClassesToElement(element, ...classesToAdd) {
  for (let clas of classesToAdd)
    element.classList.add(clas)
}
function appendElementsToParent(parent, ...children) {
  for (let child of children)
    parent.append(child)
}
function doTask(theTask, option = true) {
  const task = doElement(null, 'div', 'task');
  task.setAttribute('draggable', 'true')
  const taskId = doElement(theTask.id, 'div', 'task-id');
  const taskTitle = doElement(theTask.title, 'div', 'task-title')
  const taskActions = doElement(null, 'div', 'task-actions')
  const elementsToAppend = [taskId, taskTitle, taskActions]
  if (option) {
    for (let i = 0; i < 3; i++) {
      const actionHolder = doElement(null, 'div', 'action-holder')
      const icon = doElement(null, 'i')
      actionHolder.append(icon)
      if (i == 0) {
        actionHolder.classList.add('update')
        addClassesToElement(actionHolder, 'update')
        addClassesToElement(icon, 'fa-solid', 'fa-pen', 'update-icon')
        icon.addEventListener('click', function () {
          showUpdateBtnAngToggle(theTask.id)
        })
      } else if (i == 1) {
        actionHolder.classList.add('delete')
        addClassesToElement(actionHolder, 'delete')
        addClassesToElement(icon, ...'fa-solid fa-trash delete-icon'.split(' '))
        icon.addEventListener('click', function () {
          deleteTask(theTask.id)
        })
      } else {
        addClassesToElement(actionHolder, 'check')
        addClassesToElement(icon, ...'fa-solid fa-check check-icon'.split(' '))
        icon.addEventListener('click', function () {
          toggleTaskStatus(theTask.id)
        })
      }
      taskActions.append(actionHolder)
    }
  }
  appendElementsToParent(task, ...elementsToAppend)
  return task
}
function checkTaskStatus(task, title) {
  const result = checkIfTaskExists(title)
  if (result >= 0) {
    if (tasks[result].status == 'checked')
      task.classList.add('checked')
  }
}
function displayTask(theTask, option) {
  const task = doTask(theTask, option)
  checkTaskStatus(task, theTask.title)
  tasksContainer.append(task)
}
function displayAllTasks(tasks) {
  for (let task of tasks)
    displayTask(task)
}
addTaskBtn.addEventListener('click', addTask)
updateTaskBtn.addEventListener('click', updateTask)
searchTaskInput.addEventListener('input', function () {
  filterTasks('search')
})
selectFilterBy.addEventListener('change', function (e) {
  filterTasks(e.target.value)
})