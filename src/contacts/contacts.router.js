import { Router }  from 'express';
import {listContacts, getContactById, removeContact, addContact, updateContact} from './contacts.controller.js';
import {contactValidationCreate, contactValidationUpdate, contactValidationId } from './contacts.middleware.js';

const contactRouter = Router();

contactRouter.get('/', listContacts);
contactRouter.get('/:contactId', contactValidationId, getContactById);
contactRouter.post('/', contactValidationCreate, addContact);
contactRouter.delete('/:contactId', contactValidationId, removeContact);
contactRouter.patch('/:contactId', contactValidationUpdate, contactValidationId, updateContact);

export default contactRouter;