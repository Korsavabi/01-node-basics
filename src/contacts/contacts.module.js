import fs from 'fs'; 
import path from 'path';
import {v4 as uuidv4} from 'uuid';
const contactsPath  = path.format({
    root: './db/',
    name: 'contacts',
    ext: '.json'
  });
  const listContacts = () =>{
    fs.readFile(contactsPath, 'utf-8', (err, data) => {
        console.table(JSON.parse(data));
        JSON.parse(data)
    });
  }


  const getContactById = (contactId) => {
      fs.readFile(contactsPath, 'utf8', (err, data) => {
          const contact = JSON.parse(data);
          contact.filter(el=> el.id === Number(contactId));
          
      })
  }
 
  const removeContact = (contactId) => {
    fs.readFile(contactsPath, 'utf-8', (err, data) => {
        const contact = JSON.parse(data);
        const deleteContact = contact.filter(el => el.id !== Number(contactId));
        // console.table(deleteContact);
        fs.writeFile(contactsPath, JSON.stringify(deleteContact), (err)=>{
            if(err){
              throw err
            }
            // console.log(`Произошла ошибка: ${contactId}`);
            listContacts()
          })

    })
  }
  const addContact = (name, email, phone) =>{
    fs.readFile(contactsPath, 'utf-8', (err, data)=>{
        const newContact =  JSON.parse(data);
        const id = uuidv4();
        newContact.push({id: id, name, email, phone});
        fs.writeFile(contactsPath, JSON.stringify(newContact), (err)=>{
            if(err){
              throw err
            }
            console.log(`Имя добавленно: ${name}, Почта: ${email}, Телефон: ${phone}`);
        })
        console.log('Lol', listContacts());
    })
}
  const updateContact = (id, reqBody) => {
fs.readFile(contactsPath, 'utf-8', (err, data)=>{
  const targetContact = JSON.parse(data);
  targetContact.findIndex((contact)=>{
    contact.id === Number(id)
  });
  if(targetContact === -1){
    return false;
  }
  (contactsPath[targetContact]={
    ...contactsPath[targetContact],
    ...reqBody
  })
fs.writeFile(contactsPath, JSON.stringify(contactsPath), (err) => {
  if(err) throw err;
})
return contactsPath[targetContact];
})
}
  export default {listContacts, getContactById, removeContact, addContact, updateContact};
