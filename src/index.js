const express = require("express");

const { v4: uuid, validate } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];


function checkRepositoryExisits(request, response, next){
  const { id } = request.params;
  const repositoryIndex = repositories.findIndex((repository => repository.id === id))
  if(repositoryIndex < 0){
    return response.status(404).json({error: "Mensagem de erro"})
  }
  request.repositoryIndex = repositoryIndex
  request.repository = repositories[repositoryIndex]
  return next()
}

app.get("/repositories", (request, response) => {

  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };
  repositories.push(repository)
  return response.status(201).json(repository);
});

app.put("/repositories/:id", checkRepositoryExisits, (request, response) => {
  const {repository} = request
  const { title, url, techs } = request.body


  if (title) {
    repository.title = title
  }
  if (url) {
    repository.url = url
  }
  if (techs) {
    repository.techs = techs
  }

  return response.status(200).json(repository)

});

app.delete("/repositories/:id",checkRepositoryExisits, (request, response) => {
  const {repositoryIndex} = request

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send()

});

app.post("/repositories/:id/like", checkRepositoryExisits, (request, response) => {
  const {repository} = request

  repository.likes += 1

  return response.json(repository);
});

module.exports = app;
