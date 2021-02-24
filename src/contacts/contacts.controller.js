import { contactModel } from './contacts.modul.js';

async function  listContacts(req, res, next) {
    try {
        const contacts = await contactModel.find()
        return res.status(200).json(contacts);
    }catch(error){
        next(error);;
    }
}

async function  getContactById(res, req, next) {
    try{
        const { contactId } = req.params;
        const constact = await contactModel.findOne({ _id: contactId });
        !contact?
            res.status(404).json({massage: "Not found"})
        :
            res.status(200).json(constact);
        
    }catch(error){
        next(error);;
    }
}
async function addContact(res, req, next) {
    try{
        const newContact = await contactModel.create(req.body);
        return res.status(201).json(newContact);
    }catch(error){
        next(error);
    }
} 
async function removeContact(res, req, next) {
    try{
        const { contactId } = req.params;
        
        const deleteContact = await contactModel.findByIdAndDelete(contactId);

       !deleteContact?
            res.status(404).json({ message: "Not found" })
        :
            res.status(200).json({ message: "contact deleted" });
        
        
    }catch(error){
        next(error);
    }
}

async function updateContact(res, req, next){
    try{
        const { contactId } = req.params;
        const targetContact = await contactModel.findByIdAndUpdate(
            contactId,
            {$set: req.body},
            {new: true}
        );
        !targetContact?
            res.status(404).json({ message: "Not found" })
        :
            res.status(200).json(targetContact);
        
    }catch(error){
        next(error);
    }

}

  export {
      listContacts, getContactById, 
      removeContact, addContact, updateContact};
