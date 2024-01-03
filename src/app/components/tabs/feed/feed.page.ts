import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollCustomEvent, IonicModule, ModalController } from '@ionic/angular';
import { ControllersService } from 'src/app/services/contoller/controllers.service';
import { User } from 'src/app/model/user.interface';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Subscription, async } from 'rxjs';
import { FeedService } from 'src/app/services/feed/feed.service';
import { Comment, Post } from 'src/app/model/post.interface';
import { CommentSectionPage } from './comment-section/comment-section.page';
import {Howl} from "howler";

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class FeedPage implements OnInit {
  photos = [];
  posts: Post[] = [];
  user: User = {};
  postForm: FormGroup;
  postImage: string;
  loading: boolean = true;
  private pageNo: number = 1;
  private limit: number = 5;
  private commentsSubscription: Subscription;
  constructor(private feed: FeedService, private controller: ControllersService, private modalCtrl: ModalController) { }

  ngOnInit() {
    this.postForm = new FormGroup({
      caption: new FormControl(null)
    });
    this.getPosts(this.pageNo, this.limit);
    this.commentsSubscription = this.feed.getCommentsListener().subscribe((res: Comment) => {
      this.posts.forEach((post: Post) => {
        if (post._id === res.post_id) {
          post.comments = res.totalComments;
        }
      })
    })
  }

  ngOnDestroy() {
    this.commentsSubscription.unsubscribe();
  }

  ionViewWillEnter() {
    this.user = {
      _id: localStorage.getItem('_id'),
      firstName: localStorage.getItem('firstName'),
      lastName: localStorage.getItem('lastName'),
      accountName: localStorage.getItem('accountName'),
      dateOfBirth: localStorage.getItem('dateOfBirth'),
      reviews: Number(localStorage.getItem('reviews')),
      profilePic: localStorage.getItem('profilePic')
    }
  }

  getPosts(pageNo: number, limit: number) {
    this.loading = true;
    this.feed.getPosts(pageNo, limit).subscribe((posts: any) => {
      console.log(posts)
      posts.data?.forEach((post: any) => {
        this.posts.push({
          _id: post._id,
          caption: post.caption,
          firstName: post.user[0].firstname,
          lastName: post.user[0].lastname,
          userProfilePic: post.user[0].profileImage ? post.user[0].profileImage : 'https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-2048x1949-pq9uiebg.png',
          postImage: post.media[0],
          createDate: post.createdAt.split('T')[0],
          createTime: post.createdAt.split('T')[1].split('.')[0].split(':')[0] + ':' + post.createdAt.split('T')[1].split('.')[0].split(':')[1], 
          likes: post.likes.length,
          comments: post.comments.length,
        });
        if (post.likes.includes(this.user._id))
          this.posts[this.posts.length - 1].postLiked = true;
        else
          this.posts[this.posts.length - 1].postLiked = false;
      })
      this.pageNo++;
      this.loading = false;
    }, error => {
      this.controller.toast(error.error.message ? error.error.message : 'Error Fetching Posts', 'toastbgRed');
      this.loading = false;
    });
  }

  async onPost() {
    if (this.postForm.value.caption === null && this.photos.length === 0) {
      this.controller.toast('Please add a caption or photo to post', 'toastbgRed')
      return;
    }
    const form = new FormData();
    form.append('_id', this.user._id);
    if (this.postForm.value.caption !== null)
      form.append('caption', this.postForm.value.caption);
    if (this.photos.length !== 0)
      form.append('file', this.photos[0]);
    const loading = await this.controller.loading('Uploading Post...');
    await loading.present();
    this.feed.post(form).subscribe(async response => {
      this.posts = [];
      this.pageNo = 1;
      this.photos = [];
      this.getPosts(this.pageNo, this.limit);
      await loading.dismiss();
    }, error => {
      this.controller.toast(error.error.message ? error.error.message : 'Error Uploading Post', 'toastbgRed');
      loading.dismiss();
    });
    this.postForm.reset();
    this.postImage = null;
  }

  onIonInfinite(ev: Event) {
    this.getPosts(this.pageNo, this.limit);
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 1000);
  }

  onLike(post_id: string) {
    this.posts.map(post => {
      if (post._id === post_id) {
        post.postLiked = true;
      }
    })
    setTimeout(() => {
      this.feed.likePost(this.user._id, post_id).subscribe((res: any) => {
        if (res.data.likes.includes(this.user._id)) {
          this.posts.map(post => {
            if (post._id === post_id) {
              post.likes++;
              post.postLiked = true;
            }
          })
        }
        else {
          this.posts.map(post => {
            if (post._id === post_id) {
              post.likes--;
              post.postLiked = false;
            }
          })
        }
      },error=>{
        this.posts.map(post => {
          if (post._id === post_id) {
            post.postLiked = false;
          }
        })
      })
    }, 500);

    const sound = new Howl({
      src: ['../../../assets/sounds/fb.mp3'],
      volume: 0.5,
    });
    sound.play();
  }

  async onComment(post_id: string) {
    const modal = await this.modalCtrl.create({
      component: CommentSectionPage,
      initialBreakpoint: 0.9,
      showBackdrop: true,
      breakpoints: [0.4, 0.6, 0.9],
      handle: true,
      handleBehavior: 'cycle',
      cssClass: 'comments-modal',
      componentProps: {
        post_id: post_id,
        user_id: this.user._id
      }
    })
    await modal.present();
  }

  async takePhoto() {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    this.postImage = capturedPhoto.webPath;
    await this.savePicture(capturedPhoto);
  }


  handleRefresh(event) {
    this.pageNo = 1;
    this.posts = []
    this.getPosts(this.pageNo, this.limit);
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  private async savePicture(photo: Photo) {
    const response = await fetch(photo.webPath!);
    const blob = await response.blob();
    const file = new File([blob], "filename");
    this.photos = [];
    this.photos.push(file);
  }
  // takeVideo() {
  //   this.controller.takeVideo();
  // }
  // selectDocument() {
  //   this.controller.selectDocument();
  // }
}
