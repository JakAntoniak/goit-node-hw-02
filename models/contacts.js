// const fs = require("fs");
// const path = require("path");
// const { v4: uuidv4 } = require("uuid");
import { Contact } from "../schema/schema.js";

// const contactsPath = path.join(__dirname, "contacts.json");

export const listContacts = async () => {
  try {
    return await Contact.find();
  } catch (err) {
    console.log(err.message);
  }
};

// export const getContactById = async (contactId) => {
//   try {
//     const contacts = JSON.parse(fs.readFileSync(contactsPath));
//     const selectedId = contacts.find((el) => el.id === contactId);
//     return selectedId;
//   } catch (err) {
//     console.log(err);
//   }
// };

export const removeContact = async (contactId) => {
  try {
    // const contacts = JSON.parse(fs.readFileSync(contactsPath));
    return await Contact.findByIdAndRemove({ _id: contactId });

    // if (indexToRemove === -1) {
    //   return;
    // }
    // contacts.splice(indexToRemove, 1);
    // fs.writeFileSync(contactsPath, JSON.stringify(contacts));
    // return contacts;
  } catch (err) {
    console.log(err);
  }
};

export const addContact = async (body) => {
  try {
    // const contacts = JSON.parse(fs.readFileSync(contactsPath));
    const { name, email, phone } = body;
    const newContact = {
      name,
      email,
      phone,
    };
    return Contact.create(newContact);
  } catch (err) {
    console.log(err);
  }
};

// export const updateContact = async (contactId, body) => {
//   try {
//     const contacts = JSON.parse(fs.readFileSync(contactsPath));
//     const contactToUpdate = contacts.find((el) => el.id === contactId);
//     const { name, email, phone } = body;
//     contactToUpdate.name = name || contactToUpdate.name;
//     contactToUpdate.email = email || contactToUpdate.email;
//     contactToUpdate.phone = phone || contactToUpdate.phone;

//     fs.writeFileSync(contactsPath, JSON.stringify(contacts));
//     return contacts;
//   } catch (err) {
//     console.log(err);
//   }
// };

// module.exports = {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact,
// };
