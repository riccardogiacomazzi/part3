const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
} else if (process.argv.length < 5) {
  console.log("give contact name and number as argument");
  process.exit(1);
}

const password = process.argv[2];
const contactName = process.argv[3];
const contactNumber = process.argv[4];

const url = `mongodb+srv://fullstack:${password}@part3.k1vpeok.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Contact = mongoose.model("Contact", phonebookSchema);

const contact = new Contact({
  name: contactName,
  number: contactNumber,
});

contact.save().then((result) => {
  console.log(`added ${result.name} to phonebook`);
  mongoose.connection.close();
});
