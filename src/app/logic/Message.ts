export class Message {

  // Properties
  subject: string;
  name: string;
  email: string;
  phone: number;
  body: string;

  constructor(public subject: string = null, public name: string = null, public email: string = null,
              public phone: number = null, public body: string = null) {}

}
