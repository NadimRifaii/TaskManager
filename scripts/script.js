const addTaskInput = document.querySelector('.add-task-input')
const searchTaskInput = document.querySelector('.search-task-input')
const tasksContainer = document.querySelector('.tasks-container');
const addTaskBtn = document.querySelector('button.add-btn')
let tasks = []
if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'))
  for (let task of tasks)
    displayTask(task)
}
let tasksCounter = tasks.length
function addTask() {
  const taskTitle = addTaskInput.value;
  const task = {
    id: tasksCounter,
    title: taskTitle
  }
  tasks.push(task)
  tasksCounter++;
  localStorage.setItem('tasks', JSON.stringify(tasks))
  addTaskInput.value = null
  displayTask(task)
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
function displayTask(theTask) {
  const task = doElement(null, 'div', 'task');
  const taskId = doElement(theTask.id, 'div', 'task-id');
  const taskTitle = doElement(theTask.title, 'div', 'task-title')
  const taskActions = doElement(null, 'div', 'task-actions')
  const elementsToAppend = [taskId, taskTitle, taskActions]
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
    } else {
      addClassesToElement(actionHolder, 'check')
      addClassesToElement(icon, ...'fa-solid fa-check check-icon'.split(' '))
    }
    taskActions.append(actionHolder)
  }
  appendElementsToParent(task, ...elementsToAppend)
  tasksContainer.append(task)
}

addTaskBtn.addEventListener('click', addTask)