const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");

const Contact = require("./models/contact");

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  next(error);
};

app.use(cors());
app.use(express.json());
app.use(express.static("dev"));

// // Morgan token and conditional setup NOT WORKING -> PREVENTS GET AND POST REQUESTS
// morgan.token("data", (req) => JSON.stringify(req.body));

// app.use((req, res, next) => {
//   if (req.method === "POST") {
//     morgan(":method :url :status :res[content-length] :response-time ms :data")(req, res, next);
//   } else {
//     morgan("tiny")(req, res, next);
//   }
//   next();
// });

//Hardcoded array of persons in the phonebook
let persons = [];

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
    response.json(contacts);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  Contact.findById({ _id: request.params.id })
    .then((contact) => {
      if (contact) {
        response.json(contact);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      // console.log(error);
      // response.status(400).send({ error: "malformatted id" });
      next(error);
    });
});

// DELETE;
app.delete("/api/persons/:id", (request, response) => {
  Contact.findByIdAndDelete({ _id: request.params.id }).then((contactDeleted) => {
    console.log("deleted:", contactDeleted);
    response.json(contactDeleted);
  });
});

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

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
