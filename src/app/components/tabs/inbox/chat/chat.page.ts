import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InfiniteScrollCustomEvent, IonContent, IonicModule } from '@ionic/angular';
import { PusherService } from 'src/app/services/pusher/pusher.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user.interface';
import { Message } from 'src/app/model/message.interface';
import { ControllersService } from 'src/app/services/contoller/controllers.service';
import {Howl} from 'howler';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class ChatPage implements OnInit {
  user: User;
  chatForm: FormGroup;
  user_id: string;
  messages: Message[] = [];
  page: number = 1;
  limit: number = 10;
  loading: boolean = false;
  @ViewChild(IonContent) content: IonContent;
  private userSub: Subscription;
  constructor(private pusherService: PusherService, private chatService: ChatService, private controller: ControllersService) {
    const channel = this.pusherService.getPusherInstance().subscribe('OneToOne');
    this.user_id = localStorage.getItem('_id');
    channel.bind(`chat-${this.user_id}`, (data: any) => {
      console.log(data);

      this.messages.push({
        content: data.message.content,
        isSender: false,
        sender_id: data.message.sender_id,
        receiver_id: data.message.receiver_id,
        createdAt: new Date().toLocaleTimeString().slice(0, 5)
      });
      this.scrollToBottom();
      const sound = new Howl({
        src: ['../../../assets/sounds/fb.mp3'],
        volume: 0.5,
      });
      sound.play();
    });
  }

  ngOnInit() {
    this.chatForm = new FormGroup({
      message: new FormControl('', Validators.required)
    })
  }

  ionViewWillEnter() {
    this.userSub = this.chatService.getUserListener().subscribe((user: User) => {
      this.user = {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePic: user.profilePic
      }
    });
    this.getMessages(this.page, this.limit, false)
  }

  getMessages(page: number, limit: number, up: boolean) {
    this.loading = true;
    this.chatService.getMessages(this.user_id, this.user._id, page, limit).subscribe((res: any) => {
      console.log(res);
      res.data?.forEach((msg: any) => {
        const timestamp = msg.createdAt;
        const dt = new Date(timestamp);
        const hours = dt.getUTCHours();
        const minutes = dt.getUTCMinutes();
        const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        this.messages.unshift({
          content: msg.content,
          isSender: msg.senderID == this.user_id ? true : false,
          sender_id: msg.senderID,
          receiver_id: msg.receiverID,
          createdAt: formattedTime
        });
        this.chatService.setLastMessageListener({
          content: msg.content,
          _id: this.user_id
        });
      });
      this.page++;
      if (!up) {
        this.scrollToBottom();
      }
      this.loading = false;
    }, error => {
      this.loading = false;
      this.controller.toast(error.error.message ? error.error.message : "Request Timed Out", 'toastbgRed')
    })
  }

  onIonInfinite(ev: Event) {
    this.getMessages(this.page, this.limit, true);
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 1000);
  }

  ionViewWillLeave() {
    this.userSub.unsubscribe();
  }


  onSend() {
    if (this.chatForm.valid) {
      this.messages.push({
        content: this.chatForm.value.message,
        isSender: true,
        sender_id: this.user_id,
        receiver_id: this.user._id,
        createdAt: new Date().toLocaleTimeString().slice(0, 5)
      });
      this.scrollToBottom();
      this.chatService.sendMessage(this.user_id, this.user._id, this.chatForm.value.message).subscribe((res: any) => {
        console.log(res);
      }, error => {
        this.messages.pop();
      })
      this.chatForm.reset();
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      this.content.scrollToBottom()
    }, 100);
  }
}
