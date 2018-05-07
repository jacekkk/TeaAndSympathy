export class Message {

  // Properties
  subject: string = '';
  name: string = '';
  email: string = '';
  phone: number = null;
  body: string = '';
  photoUrl = [];

  constructor() {
  }

  public toString(): string {
    return 'Subject: ' + this.subject + '\nName: ' + this.name + '\nEmail: ' + this.email + '\nPhone: ' + this.phone +
      '\nBody: ' + this.body + '\nNumber of photo urls: ' + this.photoUrl.length;
  }
}
