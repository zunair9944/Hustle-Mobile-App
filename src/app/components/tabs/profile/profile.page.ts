import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { UserAuthService } from 'src/app/services/user-auth/user-auth.service';
import { Subscription } from 'rxjs';
import { User } from 'src/app/model/user.interface';
import { Router, RouterModule } from '@angular/router';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,RouterModule]
})
export class ProfilePage implements OnInit {
  user: User = {};
  private userSubscription:Subscription;
  constructor(private authService: UserAuthService,private router:Router,private profileService:ProfileService) { }
  ngOnInit() {
  }

  ionViewWillEnter(){
    this.user = {
      _id: localStorage.getItem('_id'),
      firstName: localStorage.getItem('firstName'),
      lastName: localStorage.getItem('lastName'),
      accountName: localStorage.getItem('accountName'),
      dateOfBirth: localStorage.getItem('dateOfBirth'),
      reviews: Number(localStorage.getItem('reviews')),
      profilePic: localStorage.getItem('profilePic')? localStorage.getItem('profilePic') : 'https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-2048x1949-pq9uiebg.png',
    };
    this.userSubscription = this.profileService.getUser().subscribe(user=>{
      this.user = user;
    })
  }
  ionViewWillLeave(){
    this.userSubscription.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  editProfile(){
    this.router.navigate(['/tabs/profile/update']);
  }


}
