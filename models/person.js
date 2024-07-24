const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const url = process.env.MONGODB_URI;

mongoose
  .connect(url)
  .then((result) => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /(\d{2}-\d{5,})|(\d{3}-\d{4,})/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid phone number. It should be at least 8 characters long, with two parts separated by a hyphen. The first part should have 2 or 3 digits, and the second part also consists of digits`,
    },
    minLength: 8,
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
