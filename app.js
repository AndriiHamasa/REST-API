// const express = require('express')
import express from "express";
import logger from "morgan";
import cors from "cors";
// const logger = require('morgan')
// const cors = require('cors')

// const contactsRouter = require('./routes/api/contacts')
import { contactsRouter } from "./routes/api/contacts.js";

export const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});
// module.exports = app

// -------------------------------------------------------------
// import path from "path";
// import fs from 'fs/promises'
// const contactsPath = path.resolve('models', 'contacts.json')
// const getContacts = async () => {
//   const result = await fs.readFile(contactsPath)
//   console.log('result - ', JSON.parse(result))
//   return JSON.parse(result)
// }
// const app = express();

// app.get("/", (request, response) => {
//   response.send("<h1>Home Page</h1>");
// });

// app.get("/contacts", async(req, res) => {
//   res.json(await getContacts())
// });

// app.listen(3000, () => console.log("Server running on 3000 PORT"));
