import {Injectable} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Message } from './Message';
import {Timestamp} from 'rxjs/operators/timestamp';

@Injectable()
export class MessageService
{
  constructor(private firebase: AngularFireDatabase) {}

  insertMessage(message: Message) {
    const firebaseRef = this.firebase.database.ref().child('messages');
    firebaseRef.child(Date.now().toLocaleString()).set(message);
  }
}
