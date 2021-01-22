const fs = require('fs');
const path = require('path');
const newId = Date.now();
const contactsPath  = path.format({
  root: './db/',
  name: 'contacts',
  ext: '.json'
});

function listContacts() {
    fs.readFile(contactsPath, 'utf-8', (err, data) => {
      console.table(JSON.parse(data));
  });
  }

  function getContactById(contactId) {
    fs.readFile(contactsPath, 'utf-8', (err, data) =>{
      const contanct = JSON.parse(data)
      const newContact = contanct.filter(el => el.id === contactId);
      console.table(newContact);
    });
  }


  function removeContact(contactId) {
    fs.readFile(contactsPath, 'utf-8', (err, data) =>{
      const contanct = JSON.parse(data)
      const deleteContact = contanct.filter(el => el.id !== contactId);
      console.table(deleteContact);
      fs.writeFile(contanct, JSON.stringify(deleteContact), (err)=>{
        if(err){
          throw err
        }
        console.log(`Произошла ошибка: ${contactId}`);
        listContacts()
      })

    });
  }

  function addContact(name, email, phone) {
    fs.readFile(contactsPath, 'utf-8', (err, data) =>{
          const newContact = JSON.parse(data);
          newContact.push({id: newId, name: name, email: email, phone: phone});
          console.table(newContact);
          fs.writeFile(newContact, JSON.stringify(newContact), (err)=>{
            if(err){
              throw err
            }
            console.log(`Имя добавленно: ${name}, Почта: ${email}, Телефон: ${phone}`);
            listContacts()
          })
        });
  }

  module.exports = {listContacts,getContactById,removeContact,addContact};