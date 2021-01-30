import { Router }  from 'express';
import {listContact, findContact, addContacts, deleteContact, patchContact} from './contacts.controller.js';

const userRouter = Router();

userRouter.get('/', listContact);
userRouter.get('/:contactId', findContact);
userRouter.post('/', addContacts);
userRouter.delete('/:contactId', deleteContact);
userRouter.patch('/:contactId', patchContact);

export { userRouter };