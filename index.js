// **** for validations (returns a class)****
const Joi = require("joi");

// **** ****
const express = require("express");

// **** create express application (server) ****
const app = express();

// **** enable parsing of JSON objects by express ****
app.use(express.json());

// **** function to validate patient ****
function validatePatient(patient) {
  // **** define validation schema ****
  const schema = {
    name: Joi.string()
      .min(6)
      .required()
  };

  // **** validate the patient ****
  const result = Joi.validate(patient, schema);

  // **** return validation result ****
  return result;
}

// **** define some patients in an array of objects (will use MongoDB in the future) ****
const patients = [
  { id: 1, name: "James Bond" },
  { id: 2, name: "Money Penny" },
  { id: 3, name: "John Canessa" },
  { id: 4, name: "Jane Doe" },
  { id: 5, name: "John Doe" }
];

/*
 * route and handle (delete patient by id)
 */
app.delete("/api/patients/id/:id", (req, res) => {
  // **** extract the patient ID ****
  const patientID = req.params.id;

  // ???? log the patient ID ????
  console.log(`patientID: ${patientID}`);

  // **** look up the patient in the database (array) ****
  const patient = patients.find(p => p.id === parseInt(patientID));

  // **** patient ID not found ****
  if (!patient) return res.status("404").send(`patient ${patientID} NOT found`);

  // ???? ????
  console.log(`patient.id: ${patient.id} patient.name: ${patient.name}`);

  // **** find the patient index in the database (array) ****
  const index = patients.indexOf(patient);

  // ???? ????
  console.log(`index: ${index}`);

  // **** delete the patient from the database (array) ****
  patients.splice(index, 1);

  // **** return the patient info ****
  res.send(patient);
});

/*
 * route and handler (update specified patient record)
 */
app.put("/api/patients/id/:id", (req, res) => {
  // **** extract the patient ID ****
  const patientID = req.params.id;

  // ???? log the patient ID ????
  console.log(`patientID: ${patientID}`);

  // **** look up the patient in the database ****
  const patient = patients.find(p => p.id === parseInt(patientID));

  // **** patient not found ****
  if (!patient)
    return res.status("404").send(`patientID: ${patientID} NOT found`);

  // **** ****
  // const result = validatePatient(req.body);
  const { error } = validatePatient(req.body); // result.error

  // **** check for validation error ****
  if (error) return res.status(400).send(error.details[0].message);

  // **** update the patient record ****
  patient.name = req.body.name;

  // **** return the updated patient record to client ****
  res.send(patient);
});

/*
 * route and handler (post new patient)
 */
app.post("/api/patients", (req, res) => {
  // **** (using object destructuring) ****
  const { error } = validatePatient(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // **** set the patient data ****
  const patient = {
    id: patients.length + 1, // MongoDB would generate an ID
    name: req.body.name // patient name provided by caller (enable parsing of JSON objects)
  };

  // **** insert patient record into array (MongoDB) ****
  patients.push(patient);

  // ???? inform the user what is going on ????
  console.log(`patient.id: ${patient.id} patient.name ==>${patient.name}<==`);

  // **** send the patient record to the caller (caller needs to know patient ID) ****
  res.send(patient);
});

/*
 *route and handler (check if alive)
 */
app.get("/", (req, res) => {
  res.send("storage server is up and running !!!");
});

// **** route and handler (list of all patients) ****
app.get("/api/patients", (req, res) => {
  res.send(patients);
});

/*
 * route and handler (single patient by ID)
 */
app.get("/api/patients/id/:id", (req, res) => {
  // **** extract the patient ID ****
  const patientID = req.params.id;

  // ???? log patient ID ????
  console.log(`patientID: ${patientID}`);

  // **** find the data in the array (in MongoDB) ****
  const patient = patients.find(p => p.id === parseInt(patientID));

  // **** send the patient back to the caller ****
  if (!patient) return res.status("404").send(`patient ${patientID} NOT found`);

  // **** send response ****
  res.send(patient);
});

/*
 * route and handler (single patient by name)
 */
app.get("/api/patients/name/:name", (req, res) => {
  // **** get the patient name ****
  const patientName = req.params.name;

  // ???? display the patient name ????
  console.log(`patientName ==>${patientName}<==`);

  // **** find the data in the array (in MongoDB) ****
  const patient = patients.find(p => p.name === patientName);

  // **** send the patient record to the caller ****
  if (!patient)
    return res.status("404").send(`patient ==>${patientName}<== NOT found`);

  // **** send response ****
  res.send(patient);
});

/*
 * route and handler (patient name)
 */
app.get("/api/patients/name/:fn/:ln", (req, res) => {
  // **** extract the name of the patient ****
  var patientFirstName = req.params.fn;
  var patientLastName = req.params.ln;

  // ???? ????
  console.log(`patient name: ${patientFirstName}, ${patientLastName}`);

  // **** find the record in the array (in MongoDB) ****
  const patient = patients.find(
    p => p.name === patientFirstName + " " + patientLastName
  );

  // **** send the patient record to the caller ****
  if (!patient)
    return res
      .status("404")
      .send(`patient ==>${patientFirstName} ${patientLastName}<== NOT found`);

  // **** ****
  res.send(patient);
});

// **** route and handler (studies per date) ****
app.get("/api/studies/date/:year/:month/:day", (req, res) => {
  var year = req.params.year;
  var month = req.params.month;
  var day = req.params.day;

  // ???? ????
  console.log(req.query);

  console.log(`year: ${year} month: ${month} day: ${day}`);

  // **** send response ****
  res.send(req.params);
});

// **** define the port to listen on ****
// const port = 4444;
const port = process.env.STORAGE_SERVER_PORT || 4444;

// **** listener info ****
app.listen(port, () => {
  console.log(`storage server listening on port:  ${port} ...`);
});
