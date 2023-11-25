const express = require("express");
const router = express.Router();

const { getAllContacts, getContactById, addContacts, updateContact, deleteContact, updateContactStatus } = require("../../models/contacts");

router.get("/", getAllContacts);

router.get("/:contactId", getContactById);

router.post("/", addContacts);

router.delete("/:contactId", deleteContact);

router.put("/:contactId", updateContact);

router.patch("/:contactId/favorite", updateContactStatus);

module.exports = router;

