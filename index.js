const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const Contact = require("./models/contact");

//Error handler setup
const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(cors());
app.use(express.json());
app.use(express.static("dev"));

// GET;
app.get("/", (request, response) => {
  response.send("<h1>Phonebook backend</h1>");
});

app.get("/info", (request, response) => {
  const utcTime = new Date(Date.now());
  Contact.countDocuments({}).then((count) => {
    let info = `<p>Phonebook has info for ${count} people</p> <p>${utcTime}</p>`;
    response.send(info);
  });
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
      next(error);
    });
});

// DELETE;
app.delete("/api/persons/:id", (request, response) => {
  Contact.findByIdAndDelete({ _id: request.params.id }).then((contactDeleted) => {
    console.log("contact deleted:", contactDeleted);
    response.json(contactDeleted);
  });
});

// POST
app.post("/api/persons", (request, response, next) => {
  const contact = new Contact({
    name: request.body.name,
    number: request.body.number,
  });
  contact
    .save()
    .then((contactAdded) => {
      console.log("contact added:", contactAdded);
      response.json(contactAdded);
    })
    .catch((error) => next(error));
});

// PUT
app.put("/api/persons/:id", (request, response) => {
  Contact.findByIdAndUpdate({ _id: request.params.id }, { number: request.body.number }).then((contactUpdated) => {
    console.log("updated contact:", contactUpdated);
    response.json(contactUpdated);
  });
});

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
