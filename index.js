const express = require('express');
const server = express();
server.use(express.json());

const projects = [];

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  projects.push({
    id, 
    title,
    tasks: []
  });

  return res.json(projects);
});

function checkProjectExists(req, res, next) {
  const { id } = req.params;
  const index = projects.findIndex((project) => project.id === id);
  if (index === -1) {
    return res.status(400).json({ error: 'Project does not exist' });
  }

  req.project = projects[index];
  req.projectIndex = index;

  return next();
}

function logRequests(req, res, next) {
  console.count('Request count');

  return next();
}

server.use(logRequests);

server.get('/projects', (req, res) => {
  return res.json(projects);
});

server.put('/projects/:id', checkProjectExists, (req, res) => {
  const { title } = req.body;

  req.project.title = title;

  return res.json(projects);
});

server.delete('/projects/:id', checkProjectExists, (req, res) => {
  projects.splice(req.projectIndex, 1);

  return res.send();
});

server.post('/projects/:id/tasks', checkProjectExists, (req, res) => {
  const { title } = req.body;

  req.project.tasks.push(title);

  return res.json(projects);
});

server.listen(3000);
