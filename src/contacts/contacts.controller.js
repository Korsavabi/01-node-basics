// import {listContacts, getContactById, removeContact, addContact, updateContact} from './contacts.module.js';
import contactsFunctions from './contacts.module.js';

import  { contactValidation }  from '../helpers/validate.js';

export const listContact = (req, res) =>{
    const contacts = contactsFunctions.listContacts();
    return res.status(200).json(contacts);
}

export const findContact = (req, res) =>{
    let id = req.params.contactId;
    const contact = contactsFunctions.getContactById(id);
    if(!contact.lenght){
        return res.status(404).json({message: "Not found"})
    }
    res.status(200).json(contact);
}
export const deleteContact = (req, res) => {
    let id = req.params.contactId;
    const contact = contactsFunctions.removeContact(id);
    if(contact){
        return res.status(200).json({ message: "contact deleted" });
    }
    res.status(404).json({message: "Not found"})
}

export const addContacts = (req, res) => {
    const {error} = contactValidation.validate(req.body);

    if(error){
        res.status(400).json({massage: "missing required name field"});
        return;
    }
    const contacts = contactsFunctions.addContact(
        req.body.name,
        req.body.email,
        req.body.phone
    )
    
    return res.status(201).json(contacts);
}
export const patchContact = (req, res) =>{
    if(Object.keys(req.body).length == 0){
        res.status(400).json({massage: "missing fields"});
        return
    }
    let id = req.params.contactId;

    const contact = contactsFunctions.updateContact(id, req.body);

    if(contact){
        return res.status(200).json(contact);
    }
    res.status(404).json({massage: "Not found"});
}