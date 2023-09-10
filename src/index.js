const addBtn = document.querySelector("#btnAddNewTask");
const clearBtn = document.querySelector("#btnClear");
const textInput = document.querySelector("#txtTaskName");
const filters = document.querySelectorAll(".filters span");
let editMode= false;
let editId;

let taskList = [];
if(localStorage.getItem("taskList") !== null)
    taskList=JSON.parse(localStorage.getItem("taskList"));
displayTasks("all");
function displayTasks(filter) {
    let ul = document.querySelector("#task-list");
    ul.innerHTML = "";
    for (let task of taskList) {
        let completed = task.state == "completed"? "checked" : ""
        if(filter == task.state || filter == "all"){
            let li = `
            <li class="task list-group-item">
                <div class="form-check">
                    <input onclick="updateStatus(this)" type="checkbox" id="${task.id}" class="form-check-input" ${completed}>
                    <label for="${task.id}" class="form-check-label ${completed}">${task.taskName}</label>
                </div>
                <div class="dropdown">
                    <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="fa-solid fa-ellipsis"></i>
                    </button>
                    <ul class="dropdown-menu">
                        <li><a onclick="deleteTask(${task.id})" class="dropdown-item" href="#">Sil <i class="fa-solid fa-trash-can float-end"></i></a></li>
                        <li><a onclick='editTask(${task.id},"${task.taskName}")' class="dropdown-item" href="#">Düzenle <i class="fa-regular fa-pen-to-square float-end"></i></a></li>
                    </ul>
                </div>
            </li>
            `;
        ul.insertAdjacentHTML("beforeend", li);
        }
    }
}
function addTask(event){
    if(textInput.value.trim()==""){
        alert("Bu alan boş bırakılamaz!");
        textInput.focus();
    }
    else{
        if(!editMode)
            taskList.push({"id":taskList.length+1,"taskName":textInput.value,"state":"pending"});
        else{
            for(index in taskList){
                if(taskList[index].id==editId){
                    taskList[index].taskName = textInput.value
                }
                editMode=false;
                addBtn.textContent="Ekle";
            }
        }   
    }  
    textInput.value="";
    localStorage.setItem("taskList",JSON.stringify(taskList));
    displayTasks(document.querySelector("span.active").id);

    event.preventDefault();
}

function deleteAllTasks(){
    taskList.splice(0,taskList.length);
    localStorage.setItem("taskList",JSON.stringify(taskList));
    displayTasks("all");
}

function deleteTask(id){
    let deletedId = taskList.findIndex(task=>task.id==id);
    taskList.splice(deletedId,1);
    localStorage.setItem("taskList",JSON.stringify(taskList));
    displayTasks(document.querySelector("span.active").id);
}

function editTask(id,taskname){
    editMode=true;
    editId=id;
    addBtn.textContent="Düzenle";
    textInput.value=taskname;
    textInput.focus();
}

function updateStatus(selectedTask){
    let label = selectedTask.nextElementSibling;
    let state;
   if(selectedTask.checked){
        label.classList.add("checked");
        state = "completed";
   }
    else{
        label.classList.remove("checked");
        state = "pending";
    } 
    for(let task of taskList){
        if(task.id==selectedTask.id){
            task.state=state;
        }
    }
    localStorage.setItem("taskList",JSON.stringify(taskList));
    displayTasks(document.querySelector("span.active").id);
}

for(let span of filters){
    span.addEventListener("click",()=>{
        document.querySelector("span.active").classList.remove("active");
        span.classList.add("active");
        localStorage.setItem("taskList",JSON.stringify(taskList));
        displayTasks(span.id)
    })
    
}