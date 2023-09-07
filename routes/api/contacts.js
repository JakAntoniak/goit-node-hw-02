import express from "express";
import { listContacts, addContact } from "../../models/contacts.js";

export const router = express.Router();

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.status(200).json(contacts);
});

// router.get("/:contactId", async (req, res, next) => {
//   res.json({ message: "template message" });
// });

router.post("/", async (req, res, next) => {
  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Add keys: name, email and phone" });
  }
  // const { name, email, phone } = req.body;
  const validation = schema.validate({ name, email, phone });
  const newContact = addContact(req.body);

  if (validation.error) {
    return res
      .status(400)
      .json({ message: `Key ${validation.error.details[0].message}` });
  }

  res.status(201).json(await newContact);
});

// router.delete("/:contactId", async (req, res, next) => {
//   res.json({ message: "template message" });
// });

// router.put("/:contactId", async (req, res, next) => {
//   res.json({ message: "template message" });
// });
