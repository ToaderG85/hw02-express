const service = require("../services/index");

const { contactJoiSchema } = require("../services/schemas/contactJoiSchema");

const getAllContacts = async (req, res, next) => {
 try {
  const allContacts = await service.listContacts();
  return res.status(200).json({
   status: "success",
   code: 200,
   data: { allContacts },
  });
 } catch (error) {
  next(error);
 }
};

const addContacts = async (req, res, next) => {
 try {
  const { name, phone, email, favorite } = req.body;
  const result = await service.addContact({ name, phone, email, favorite, });  
  res.status(201).json({
   status: "succes",
   code: 201,
   data: result,
  });
 } catch (error) {
  res.status(404).json({
   status: "error",
   code: 404,
  });
  next(error);
 }
};
const deleteContact = async (req, res, next) => {
 const { contactId } = req.params;
 try {
  const removedContact = await service.removeContact(contactId);
  if (removedContact) {
   return res.status(200).json({
    status: "success",
    code: 200,
    message: "contact deleted",
   });
  } else {
   return res.status(404).json({
    status: "error",
    code: 404,
    message: "Not found",
   });
  }
 } catch (error) {
  next(error);
 }
};

const getContactById = async (req, res, next) => {
 try {
  const { contactId } = req.params;
  const allContacts = await service.listContacts();
  if (allContacts.some((item) => item.id === contactId)) {
   const selectContact = await service.getContactById(contactId);
   return res.json({
    status: "success",
    code: 200,
    data: {
     result: selectContact,
    },
   });
  } else {
   return res.status(404).json({
    status: "error",
    code: 404,
    message: "Not found",
   });
  }
 } catch (error) {
  next(error);
 }
};

const updateContact = async (req, res, next) => {
 try {
  if (Object.keys(req.body).length === 0) {
   return res.status(400).json({
    status: "error",
    code: 400,
    message: "missing fields",
   });
  }
  const { error } = contactJoiSchema.validate(req.body);
  if (error) {
   return res.status(400).json({
    status: "error",
    code: 400,
    message: error.message,
   });
  }
  const { contactId } = req.params;
  const allContacts = await service.listContacts();
  if (allContacts.some((item) => item.id === contactId)) {
   const updatedContact = await service.updateContact(contactId, req.body);
   return res.json({
    status: "success",
    code: 200,
    data: {
     result: updatedContact,
    },
   });
  } else {
   return res.status(404).json({
    status: "error",
    code: 404,
    message: "Not found",
   });
  }
 } catch (error) {
  next(error);
 }
};

const updateContactStatus = async (req, res, next) => {
  const { contactId } = req.params;
  const { favorite } = req.body;
  try {
    if (Object.keys(req.body).length === 0) {
         return res.status(400).json({
          status: "error",
          code: 400,
          message: "missing field favorite",
         });
        }
        const { error } = contactJoiSchema.validate(req.body);
        if (error) {
         return res.status(400).json({
          status: "error",
          code: 400,
          message: error.message,
         });
        }
    const result = await service.updateStatusContact(contactId, { favorite });
    
    if (result) {
      res.status(200).json({
        status: "updated",
        code: 200,
        data: result,
      });
    }
  } catch (error) {
   
    res.status(404).json({
      status: "error",
    });
  }
};

module.exports = { getAllContacts, getContactById, addContacts, updateContact, deleteContact, updateContactStatus };






















// const fs = require("fs").promises;
// const path = require("path");
// const { nanoid } = require("nanoid");

// const contactsPath = path.join(__dirname, "contacts.json");

// const updateContacts = async (contacts) => {
//  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
// };

// const listContacts = async () => {
//  const contacts = await fs.readFile(contactsPath);
//  return JSON.parse(contacts);
// };

// const getContactById = async (contactId) => {
//  const contacts = await listContacts();
//  const contact = contacts.find((contact) => contact.id === contactId);
//  if (!contact) {
//   return null;
//  }
//  return contact;
// };

// const removeContact = async (contactId) => {
//  const contacts = await listContacts();
//  const index = contacts.findIndex((contact) => contact.id === contactId);
//  if (index === -1) {
//   return null;
//  }
//  const removeContact = contacts.splice(index, 1);
//  await updateContacts(contacts);
//  return removeContact;
// };

// const addContact = async (body) => {
//  const contacts = await listContacts();
//  const newContact = {
//   id: nanoid(),
//   ...body,
//  };
//  contacts.push(newContact);
//  await updateContacts(contacts);
//  return newContact;
// };

// const updateContact = async (contactId, body) => {
//  const contacts = await listContacts();
//  const index = contacts.findIndex((contact) => contact.id === contactId);
//  if (index === -1) {
//   return null;
//  }
//  contacts[index] = { id: contactId, ...body };
//  await updateContacts(contacts);
//  return contacts[index];
// };

// module.exports = {
//  listContacts,
//  getContactById,
//  addContact,
//  removeContact,
//  updateContact,
// };
