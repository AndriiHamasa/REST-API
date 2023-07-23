import fs from "fs/promises";
import path from "path";
import { nanoid } from "nanoid";

export const contactsPath = path.resolve("models", "contacts.json");
const updateContacts = (contacts) =>
  fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

export const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};

export const getContactById = async (contactId) => {
  const data = await listContacts();
  return data.find((contact) => contact.id === contactId) || null;
};

export const removeContact = async (contactId) => {
  const data = await listContacts();
  const index = data.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = data.splice(index, 1);
  await updateContacts(data);
  return result;
};

export const addContact = async ({name, email, phone}) => {
  const data = await listContacts();
  const newContact = { id: nanoid(), name, email, phone };
  data.push(newContact);
  await updateContacts(data);
  return newContact;
};

export const updateContact = async (contactId, body) => {
  const data = await listContacts();
  const contactForUpdate = data.find(contact => contact.id === contactId)
  let updatedContact = null

  if (contactForUpdate) {
    updatedContact = {id:contactId, ...body}
    data.splice(data.indexOf(contactForUpdate), 1, updatedContact)
    updateContacts(data)
  }
  return updatedContact
};

