import express from "express";
import {
  listContacts,
  addContact,
  removeContact,
} from "../../models/contacts.js";
import Joi from "joi";

export const router = express.Router();

const schema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
});

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
  const { name, email, phone } = req.body;
  const validation = schema.validate({ name, email, phone });
  const newContact = addContact(req.body);

  if (validation.error) {
    return res
      .status(400)
      .json({ message: `Key ${validation.error.details[0].message}` });
  }

  res.status(201).json(await newContact);
});

router.delete("/:contactId", async (req, res, next) => {
  const { id } = req.params;
  try {
    const contactToRemove = await removeContact(id);
    return res
      .status(200)
      .json({ message: `Contact with ID: ${id} has been removed` });
  } catch (err) {
    console.log(err);
  }
});

// router.put("/:contactId", async (req, res, next) => {
//   res.json({ message: "template message" });
// });
