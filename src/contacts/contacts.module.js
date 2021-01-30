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
        console.table(contact.filter(el=> el.id === Number(contactId)));
          
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
 const updateContact = async (contactId, reqBody) => {
const responce = await fs.promises.readFile(contactsPath, 'utf-8')
  const targetContact = JSON.parse(responce);
  const userIndex = targetContact.findIndex((contact)=>{
    contact.id === Number(contactId)  });

  if(userIndex === -1){
    return null;
  }
  targetContact[userIndex] = {
    ...targetContact[userIndex],
    ...reqBody
  };
  await fs.promises.writeFile(contactsPath, JSON.stringify(targetContact))
  
  console.table('targetContact[userIndex] - ' ,targetContact[userIndex]);
  return targetContact[userIndex];
}
  export default {listContacts, getContactById, removeContact, addContact, updateContact};
