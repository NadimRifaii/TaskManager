const addTaskInput = document.querySelector('.add-task-input')
const searchTaskInput = document.querySelector('.search-task-input')
const tasksContainer = document.querySelector('.tasks-container');
const addTaskBtn = document.querySelector('button.add-btn');
const deletTaskBtn = document.querySelector('button.delete-btn')
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
    status: false
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
function searchTask() {
  const searchedTasks = []
  for (let task of tasks) {
    if (task.title.toLowerCase().includes(searchTaskInput.value.toLowerCase())) {
      searchedTasks.push(task)
    }
  }
  tasksContainer.innerHTML = ''
  if (searchedTasks.length > 0)
    displayAllTasks(searchedTasks)
  else if (searchTaskInput.value) {
    displayTask({ id: -1, title: 'No such task' }, false)
  }
  else
    displayAllTasks(tasks)
}
function deleteTask(taskId) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == taskId) {
      const removedTask = tasks.splice(i, 1);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      tasksContainer.children[i].remove()
      return removedTask
    }
  }
}
function toggleTaskStatus(taskId) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == taskId) {
      const task = tasksContainer.children[i]
      task.classList.toggle('checked')
      if (task.classList.contains('checked')) {
        tasks[i].status = true
      } else {
        tasks[i].status = false
      }
      localStorage.setItem('tasks', JSON.stringify(tasks))
      return
    }
  }
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
      } else if (i == 1) {
        actionHolder.classList.add('delete')
        addClassesToElement(actionHolder, 'delete')
        addClassesToElement(icon, ...'fa-solid fa-trash delete-icon'.split(' '))
        icon.addEventListener('click', () => {
          deleteTask(theTask.id)
        })
      } else {
        addClassesToElement(actionHolder, 'check')
        addClassesToElement(icon, ...'fa-solid fa-check check-icon'.split(' '))
        icon.addEventListener('click', () => {
          toggleTaskStatus(theTask.id)
        })
      }
      taskActions.append(actionHolder)
    }
  }
  appendElementsToParent(task, ...elementsToAppend)
  return task
}
function displayTask(theTask, option) {
  const task = doTask(theTask, option)
  const result = checkIfTaskExists(theTask.title)
  console.log(result)
  if (result >= 0) {
    if (tasks[result].status == true)
      task.classList.add('checked')
  }
  tasksContainer.append(task)
}
function displayAllTasks(tasks) {
  for (let task of tasks)
    displayTask(task)
}
addTaskBtn.addEventListener('click', addTask)
searchTaskInput.addEventListener('input', searchTask)