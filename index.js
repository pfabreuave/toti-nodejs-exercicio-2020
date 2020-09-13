const express = require('express')
const { Sequelize, DataTypes } = require('sequelize')
const task = require('./models/task')
const Task = require('./models/task')

const app = express()
const sequelize = new Sequelize({ dialect: 'sqlite', storage: './task-list.db' })
const tasks = Task(sequelize, DataTypes)

// We need to parse JSON coming from requests
app.use(express.json())

// List tasks
app.get('/tasks', async (req, res) => {
  //res.json({ action: 'Listing tasks' })
  
  const allTasks = await tasks.findAll();
  res.json(allTasks);
  
})

// Create task
app.post('/tasks', async (req, res) => {
  const body = req.body

  await tasks.create({
    description: body.description,
    done: body.done
  }); 

  res.json({resposta:"Registro criado",data:body})
})

// Show task
app.get('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  const task = await tasks.findByPk(taskId);
  res.json(task);
})

// Update task
app.put('/tasks/:id', async (req, res) => {
  const taskId = req.params.id
  const body = req.body
  const task = await tasks.findByPk(taskId);
  task.update({
    description: body.description,
    done: body.done
  }); 
  res.json({resposta:"Registro Alterado",data:task, atualizacao:body})
})

// Delete task
app.delete('/tasks/:id', async (req, res) => {
  const taskId = req.params.id

  await tasks.destroy({where: {id:taskId}});
  res.json({resposta:"Registro excluido",taskId:taskId});
})

app.listen(3000, () => {
  console.log('Iniciando o ExpressJS na porta 3000')
})
