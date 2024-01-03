import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollCustomEvent, IonicModule, ModalController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Post } from 'src/app/model/post.interface';
import { User } from 'src/app/model/user.interface';
import { ControllersService } from 'src/app/services/contoller/controllers.service';
import { FeedService } from 'src/app/services/feed/feed.service';
import { RouterModule } from '@angular/router';
import { CommentSectionPage } from '../../feed/comment-section/comment-section.page';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.page.html',
  styleUrls: ['./my-posts.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, RouterModule]
})
export class MyPostsPage implements OnInit {
  posts: Post[] = [];
  user: User = {};
  loading: boolean = true;
  private pageNo: number = 1;
  private limit: number = 5;
  constructor(private feed: FeedService, private controller: ControllersService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.getPosts(this.pageNo, this.limit);
  }

  ionViewWillEnter() {
    this.user = {
      _id: localStorage.getItem('_id'),
      firstName: localStorage.getItem('firstName'),
      lastName: localStorage.getItem('lastName'),
      accountName: localStorage.getItem('accountName'),
      dateOfBirth: localStorage.getItem('dateOfBirth'),
      reviews: Number(localStorage.getItem('reviews')),
      profilePic: localStorage.getItem('profilePic'),
    }
  }

  getPosts(pageNo: number, limit: number) {
    this.loading = true;
    this.feed.getMyPosts(localStorage.getItem('_id'), pageNo, limit).subscribe((posts: any) => {
      posts.data.forEach((post: any) => {
        this.posts.push({
          _id: post._id,
          caption: post.caption,
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          userProfilePic: this.user.profilePic,
          postImage: post.media[0],
          createDate: post.createdAt.split('T')[0],
          createTime: post.createdAt.split('T')[1].split('.')[0],
          likes: post.likes.length,
          comments: post.comments.length
        });
      })
      this.pageNo++;
      this.loading = false;
    }, error => {
      this.loading = false;
      this.controller.toast(error.error.message ? error.error.message : "Request Timed Out", 'toastbgRed');
    });
  }

  async onComments(post_id: string) {
    const modal = await this.modalCtrl.create({
      component: CommentSectionPage,
      initialBreakpoint: 0.9,
      showBackdrop: true,
      componentProps: {
        post_id: post_id,
        user_id: this.user._id
      }
    })
    await modal.present();
  }

  onIonInfinite(ev: Event) {
    this.getPosts(this.pageNo, this.limit);
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 1000);
  }

}
