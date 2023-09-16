import { Contact } from "../schema/contactsSchema.js";

export const listContacts = async () => {
  try {
    return await Contact.find();
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getContactById = async (contactId) => {
  try {
    return await Contact.findById({ _id: contactId });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const removeContact = async (contactId) => {
  try {
    return await Contact.findByIdAndRemove({ _id: contactId });
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const addContact = async (body) => {
  try {
    const { name, email, phone } = body;
    const newContact = {
      name,
      email,
      phone,
    };
    return Contact.create(newContact);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateContact = async (contactId, body) => {
  try {
    return await Contact.findByIdAndUpdate(contactId, body);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateStatusContact = async (contactId, body) => {
  try {
    return Contact.findByIdAndUpdate(contactId, body);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
