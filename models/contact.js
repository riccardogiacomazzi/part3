const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

console.log("connecting to", url);

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [3, "must be at least 3 characters long"],
    required: [true, "is a required field"],
  },
  number: {
    type: String,
    minlength: [8, "must be at least 8 digits long"],
    validate: {
      validator: function (value) {
        const phoneNumberRegex = /^\d{2,3}-\d+$/;
        return phoneNumberRegex.test(value);
      },
      message: "Invalid phone number format. Please use the format XX-XXXXXXX or XXX-XXXXXXX.",
    },

    required: [true, "is a required field"],
  },
});

contactSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject.__v;
    delete returnedObject._id;
  },
});

module.exports = mongoose.model("Contact", contactSchema);
