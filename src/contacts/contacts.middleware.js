import Joi from 'joi';
import mongoose from 'mongoose';

const {Types} = mongoose;
const {ObjectId} = Types;

export function contactValidationCreate(req, res, next) {
    const createContact = Joi.object({
        name: Joi.string().min(3).max(30).required(),
      
        email: Joi.string().email().required(),
      
        phone: Joi.string().required(),
        subscription: Joi.string().required(),
        password: Joi.string().min(6).max(20).required(),
        token: Joi.string().token(),
      });
    const validetedContact = createContact.validate(req.body);
    if(validetedContact.error){
        return res.status(400).send({message: "missing required name field"});
    }
    next()
}
export function contactValidationUpdate(res, req, next){
    const updateContact = Joi.object({
        name: Joi.string().min(3).max(30).required(),
      
        email: Joi.string().email().required(),
      
        phone: Joi.string().required(),
        subscription: Joi.string().required(),
        password: Joi.string().min(6).max(20).required(),
        token: Joi.string().token(),
      }).min(1);

      const validatedContact = updateContact.validate(req.body);

      if(validatedContact.error){
          return res.status(400).send({message: "missing fields"})
      }
      next();
}
  export function contactValidationId(res, req, next) {
    const {contactId} = req.params;
    if(!ObjectId.isValid(contactId)){
      return res.status(400).send({message: 'invalid id'});
    }
  
    next();
  }