<template>
<div>
<!-- As a link -->
<nav class="navbar navbar-light bg-light">
  <a class="navbar-brand" href="#">
      <img src="https://d33wubrfki0l68.cloudfront.net/01c3eb4226b461efe31f5ef18eaf71a4e72f8cd6/a45a6/static/logo_mini-2-1-5e65a75a05a69178717abf0ae2529399.png">
  </a>
  <div class="nav-title">
      Proper<b>Task</b>
  </div>
    <button type="button" class="btn btn-primary" 
    data-toggle="modal" data-target="#exampleModal"
    v-on:click="changeStatus">
    <i class="fas fa-plus-square"></i> Add new
    </button>
</nav>
<div class="container">

  <!-- Modal Structure -->
<div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <form v-on:submit.prevent="sendTask">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel" v-if="edit === true">Update Task</h5>
        <h5 class="modal-title" id="exampleModalLabel" v-else>New Task</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="form-group title">
            <label for="title">Title</label>
            <input type="text" v-model="task.title" id="title" class="form-control" placeholder="Task title" required/>
        </div>
        <div class="form-group desc">
            <label for="description">Description</label>
            <textarea v-model="task.description" class="form-control" placeholder="Task description"></textarea>
        </div>
        <div class="form-group prior">
            <label for="priority">Priority</label>
            <select id="priority" v-model="task.priority" class="form-control" required>
                <option disabled selected>Select option</option>
                <option value="low">Low</option>
                <option value="mid">Mid</option>
                <option value="high">High</option>
                <option value="important">Important</option>
            </select>
        </div>
        <div class="form-group date">
            <div class="form-row">
                <div class="col">
                    <label for="startdate">Start date</label>
                    <input type="date" v-model="task.start_date" class="form-control" id="startdate" required/>
                </div>
            
                <div class="col">
                    <label for="enddate">End date</label>
                    <input type="date" v-model="task.end_date" class="form-control" id="enddate" required>
                </div>
            </div>
        </div>

        <div class="form-group assign">
            <label for="email">Assign to</label>
            <input type="email" v-model="task.email" class="form-control" id="email" placeholder="Type an email" required>
        </div>
      </div>
      <div class="modal-footer">
          <template v-if="edit === false">
                <button type="submit" class="btn btn-primary">Save task</button>
          </template>
          <template v-else>
                <button type="submit" class="btn btn-info">Update task</button>
          </template>
      </div>
    </div>
    </form>
  </div>
</div>
<div class="mt-5">
    <h3><i class="fas fa-cubes"></i> Task list</h3>
    <div class="list-group" v-if="tasks.length > 0">
        <div class="card" v-for="task of tasks" v-bind:key="task._id">
        <div class="card-header">
            <div class="title">
                <i class="fas fa-cube"></i> <b>Priority:</b> 
                <span v-if="task.priority == 'important'" class="important">{{task.priority}}</span>
                <span v-else-if="task.priority == 'high'" class="high">{{task.priority}}</span>
                <span v-else-if="task.priority == 'mid'" class="mid">{{task.priority}}</span>
                <span v-else-if="task.priority == 'low'" class="low">{{task.priority}}</span>
            </div>
            <div class="dates">
                <i class="fas fa-calendar-alt"></i>
                <span><b>Start date:</b> {{task.start_date}}</span>
                <span><b>End date:</b> {{task.end_date}}</span>
            </div>
        </div>
        <div class="card-body">
            <h5 class="card-title">Title: {{task.title}}</h5>
            <div class="card-text">Description: <br>
                <p>{{task.description}}</p>
            </div>

            <button type="button" class="btn btn-info btn-sm"
            v-on:click="updateTask(task._id)" 
            data-toggle="modal" data-target="#exampleModal">
            <i class="fas fa-pencil-alt"></i>
            </button>

            <button type="button" class="btn btn-danger btn-sm"
            v-on:click="deleteTask(task._id)">
            <i class="fas fa-trash-alt"></i></button>
        </div>
        </div>
    </div>
    <div class="alert alert-warning" role="alert" v-else-if="tasks.length == 0">
    Task list is empty. Just click on button "<a href="#" data-toggle="modal" data-target="#exampleModal">new task</a>" for add an new task to list
    </div>
</div>
</div><!-- end container -->
</div>
</template>

<script>
class Task {
    constructor(title, description, priority, start_date, end_date, email) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.start_date = start_date;
        this.end_date = end_date;
        this.email = email;
    }
}
export default {
    data() {
        return {
            task: new Task(),
            tasks: [],
            edit: false,
            taskToEdit: ''
        }
    },
    created() {
        this.getTask()
    },
    methods: {
        sendTask() {
            if(this.edit === false) {
                fetch('/api/tasks', {
                    method: 'POST',
                    body: JSON.stringify(this.task),
                    headers: {
                        'Accept':'application/json',
                        'Content-type':'application/json'
                    }
                })
                .then(res => res.json())
                .then(data => {
                    this.getTask()
                })

            } else {
                fetch('/api/tasks/' + this.taskToEdit, {
                    method: 'PUT',
                    body: JSON.stringify(this.task),
                    headers: {
                        'Accept':'application/json',
                        'Content-type':'application/json'
                    }
                })
                .then(res => res.json())
                .then(data => {
                    this.getTask()
                    this.edit = false
                })
            }

            this.task = new Task()
        },
        getTask() {
            fetch('/api/tasks')
            .then(res => res.json())
            .then(data => {
                this.tasks = data;
                jQuery('.modal').modal('hide')
            })
        },
        deleteTask(id) {
            fetch('/api/tasks/'+ id, {
                method: 'DELETE',
                headers: {
                    'Accept':'application/json',
                    'Content-type':'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                this.getTask()
            })
        },
        updateTask(id) {
            fetch('/api/tasks/'+ id)
            .then(res => res.json())
            .then(data => {
                this.task = new Task(data.title, data.description, data.priority, data.start_date, data.end_date, data.email)
                this.taskToEdit = data._id
                this.edit = true
            })
        },
        changeStatus() {
            this.task = new Task()
            this.edit = false
        }
    }
}
</script>