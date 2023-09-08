import express from "express";
import {
  listContacts,
  addContact,
  removeContact,
  getContactById,
  updateContact,
  updateStatusContact,
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

router.get("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const id = getContactById(contactId);
  res.status(200).json(await id);
});

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
  const { contactId } = req.params;

  try {
    await removeContact(contactId);
    return res
      .status(200)
      .json({ message: `Contact with ID: ${contactId} has been removed` });
  } catch (err) {
    console.log(err);
  }
});

router.put("/:contactId", async (req, res, next) => {
  const { contactId } = req.params;
  const { name, phone, email } = req.body;
  const id = getContactById(contactId);

  if (!id) {
    return res.status(404).json({ message: "Not found" });
  } else if (name || phone || email) {
    return res.status(200).json(await updateContact(contactId, req.body));
  } else {
    return res.status(400).json({ message: "Missing fields" });
  }
});

router.patch("/:contactId/favorite", async (req, res, next) => {
  const { contactId } = req.params;

  if (Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: "Missing field favorite" });
  }

  try {
    const patchFavorite = updateStatusContact(contactId, req.body);
    return res.status(200).json(await patchFavorite);
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: "Not found" });
  }
});
