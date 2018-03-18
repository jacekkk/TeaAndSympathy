import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {AngularFireStorage} from 'angularfire2/storage';
import {Message} from './Message';
import {Timestamp} from 'rxjs/operators/timestamp';

@Injectable()
export class MessageService {
  constructor(private firebase: AngularFireDatabase,
              private firebaseStorage: AngularFireStorage) {
  }

  insertMessage(message: Message) {
    const firebaseRef = this.firebase.database.ref().child('messages').child(message.name).set(message);
  }

  insertImageUrl(link: string, parentPath: string, path: any) {
    const firebaseRef = this.firebase.database.ref().child('messages').child(parentPath).child('photos').child(path).set(link);
  }
}
