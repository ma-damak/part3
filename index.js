require("dotenv").config();
const express = require("express");
var morgan = require("morgan");
const cors = require("cors");

const app = express();

const Person = require("./models/person");

app.use(express.json());
morgan.token("body", function (req, res) {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(express.static("dist"));
app.use(cors());

let persons = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/info", (request, response) => {
  const requestTime = new Date();
  response.send(
    `<p>Phone book has info for ${persons.length} people</p><p>${requestTime}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  // response.json(persons);
  Person.find({}).then((persons) => response.json(persons));
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = persons.find((p) => p.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((p) => p.id !== id);

  response.status(204).end();
});

app.post("/api/persons/", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name and/or number is missing",
    });
  }

  // for (const person of persons) {
  //   if (person.name === body.name) {
  //     return response.status(400).json({ error: "name must be unique" });
  //   }
  // }

  const person = new Person({
    // id: String(Math.floor(Math.random() * 1000000)),
    name: body.name,
    number: body.number,
  });

  // persons.concat(person);

  // response.json(person);
  person.save().then((savedPerson) => response.json(savedPerson));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`applcation is running on port ${PORT}`);
});
