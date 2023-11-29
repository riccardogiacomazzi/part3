const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");

const Contact = require("./models/contact");

app.use(cors());
app.use(express.json());
app.use(express.static("dev"));

//Hardcoded array of persons in the phonebook
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// // Morgan token and conditional setup
// morgan.token("data", (req) => JSON.stringify(req.body));

// app.use((req, res, next) => {
//   if (req.method === "POST") {
//     morgan(":method :url :status :res[content-length] :response-time ms :data")(req, res, next);
//   } else {
//     morgan("tiny")(req, res, next);
//   }
//   next();
// });

// GET;
app.get("/", (request, response) => {
  response.send("<h1>Phonebook backend</h1>");
});

app.get("/info", (request, response) => {
  utcTime = new Date(Date.now());
  response.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${utcTime}</p>`);
});

app.get("/api/persons", (request, response) => {
  Contact.find({}).then((contacts) => {
    console.log("contacts logged", contacts);
    response.json(contacts);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Contact.findById({ _id: request.params.id }).then((contact) => {
    console.log("contact by id:", contact);
    console.log("id requested:", request.param.id);
    response.json(contact);
  });
});

// DELETE
// app.delete("/api/persons/:id", (request, response) => {
//   const id = Number(request.params.id);
//   persons = persons.filter((person) => person.id !== id);
//   response.status(204).end();
// });

// // Function for generating person.id
// function getRandomInt(min, max) {
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min) + min);
// }

// POST
app.post("/api/persons", (request, response) => {
  const contact = new Contact({
    name: request.body.name,
    number: request.body.number,
  });
  contact.save().then((contactAdded) => {
    console.log(`added ${contactAdded.name} to phonebook`);
    response.json(contactAdded);
  });
});

// // POST
// app.post("/api/persons", (request, response) => {
//   const body = request.body;

//   const person = {
//     id: getRandomInt(0, 999),
//     name: body.name,
//     number: body.number,
//   };

//   const names = persons.map((person) => person.name);

//   if (!body.name || !body.number) {
//     console.log(`error: Content missing`);
//     return response.status(400).json({
//       error: "Content missing",
//     });
//   } else if (names.includes(person.name)) {
//     console.log(`error: ${person.name} is already in the phonebook`);
//     return response.status(400).json({
//       error: `${person.name} is already in the phonebook`,
//     });
//   }

//   persons = persons.concat(person);
//   response.json(person);
//   console.log(`${person.name} added`);
// });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
