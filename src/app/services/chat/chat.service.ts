import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { LastMsg } from 'src/app/model/message.interface';
import { User } from 'src/app/model/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private userListener = new BehaviorSubject<User>({})
  private lastMessageListener = new BehaviorSubject<LastMsg>({});

  constructor(private http: HttpClient) { }

  setUserListener(user: User) {
    this.userListener.next(user);
  }
  getUserListener() {
    return this.userListener.asObservable();
  }
  setLastMessageListener(message: LastMsg) {
    this.lastMessageListener.next(message);
  }
  getLastMessageListener() {
    return this.lastMessageListener.asObservable();
  }

  getInboxChat(user_id: string) {
    return this.http.get(`https://casehustle.vercel.app/api/inbox/${user_id}`);
  }

  getMessages(sender_id: string, receiver_id: string, page: number, limit: number) {
    // getMessages(sender_id: string, receiver_id: string) {
    return this.http.get(`https://casehustle.vercel.app/api/getChats/?sender_id=${sender_id}&receiver_id=${receiver_id}&page=${page}&limit=${limit}`);
    // return this.http.get(`http://localhost:4000/api/getChats/?sender_id=${sender_id}&receiver_id=${receiver_id}`);
  }

  sendMessage(sender_id: string, reciever_id: string, message: string) {
    return this.http.post('https://casehustle.vercel.app/api/send-message', {
      "senderID": sender_id,
      "receiverID": reciever_id,
      "content": message
    });
  }
}
