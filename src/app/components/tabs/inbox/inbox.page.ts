import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { User } from 'src/app/model/user.interface';
import { ChatService } from 'src/app/services/chat/chat.service';
import { Subscription, first } from 'rxjs';
import { ControllersService } from 'src/app/services/contoller/controllers.service';

@Component({
  selector: 'app-inbox',
  templateUrl: './inbox.page.html',
  styleUrls: ['./inbox.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class InboxPage implements OnInit {
  inboxUsers: User[] = [];
  loading: boolean = false;
  user_id = localStorage.getItem('_id');
  // lastMsgSub: Subscription;
  constructor(private chatService: ChatService, private controller: ControllersService) { }

  ngOnInit() {
    // this.loading = true;
    this.getInboxUsers();


    // this.lastMsgSub = this.chatService.getLastMessageListener().subscribe((message: any) => {
    //   this.inboxUsers.forEach((user: User) => {
    //     if (user._id == message.user_id) {
    //       user.lastMsg = message.content;
    //     }
    //   })
    // });
  }

  getInboxUsers(){
    this.loading = true;
    this.chatService.getInboxChat(this.user_id).subscribe((users: any) => {
      users.data?.forEach((user: any) => {
        this.inboxUsers.push({
          _id: user._id,
          firstName: user.firstname,
          lastName: user.lastname,
          profilePic: user.profileImage ? user.profileImage : 'https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-2048x1949-pq9uiebg.png'
        });
      })
      this.loading = false;
    }, error => {
      this.loading = false;
      this.controller.toast(error.error.message ? error.error.message : "Request Timed Out", 'toastbgRed');
    });
  }

  onClick(receiver_id: string, firstName: string, lastName: string, profilePic: string) {
    const user: User = {
      _id: receiver_id,
      firstName: firstName,
      lastName: lastName,
      profilePic: profilePic
    }
    this.chatService.setUserListener(user);
  }


  handleRefresh(event) {
    // this.pageNo = 1;
    this.inboxUsers = []
    this.loading = true;
    this.getInboxUsers();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

}
