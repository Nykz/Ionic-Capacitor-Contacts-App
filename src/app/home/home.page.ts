import { Component, OnInit } from '@angular/core';
import { Contacts, EmailType, PhoneType } from '@capacitor-community/contacts';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  contacts: any[] = [];
  // result: any;
  // contact: any;

  constructor() {}

  ngOnInit() {
    this.getContacts();
  }

  async getContacts() {
    try {
      const permission = await Contacts.requestPermissions();
      console.log('permission: ', permission.contacts);
      if(!permission?.contacts) return;
      else if(permission?.contacts == 'granted') {
        const result = await Contacts.getContacts({
          projection: {
            name: true,
            phones: true,
            emails: true,
            image: true
          }
        });
        console.log('result: ', result);
        this.contacts = result.contacts;
        console.log(this.contacts);
      }
    } catch(e) {
      console.log(e);
    }
  }

  joinNumbers(array) {
    return array.map(x => x.number).join(' | ');
  }

  async createContact() {
    try {
      const result = await Contacts.createContact({
        contact: {
          name: {
            given: 'Banking',
            family: ' Technyks'
          },
          phones: [
            {
              type: PhoneType.Home,
              number: '9101010110',
            },
            {
              type: PhoneType.Work,
              number: '9101010111',
            }
          ],
          emails: [
            {
              type: EmailType.Home,
              address: 'bankingtechnyks@gmail.com'
            }
          ]
        }
      });
      // this.result = result;
      const new_contact = await this.getContact(result?.contactId);
      // this.contact = new_contact;
      this.contacts.push(new_contact?.contact);
    } catch(e) {
      console.log(e);
    }
      
  }

  async getContact(contactId) {
    const new_contact = await Contacts.getContact({
      contactId: contactId,
      projection: {
        name: true,
        phones: true,
        emails: true,
        image: true
      }
    });
    // this.contact = new_contact;
    return new_contact;
  }

  async deleteContact(contactId) {
    await Contacts.deleteContact({ contactId });
    this.contacts = this.contacts.filter(x => x.contactId != contactId);
  }

  async pickContact() {
    const picked_contact = await Contacts.pickContact({
      projection: {
        name: true,
        phones: true,
        emails: true,
        image: true
      }
    });
    // this.contact = picked_contact;
    return picked_contact;
  }

}
