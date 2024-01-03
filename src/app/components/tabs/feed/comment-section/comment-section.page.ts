import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InfiniteScrollCustomEvent, IonicModule } from '@ionic/angular';
import { FeedService } from 'src/app/services/feed/feed.service';
import { ControllersService } from 'src/app/services/contoller/controllers.service';
import { Comment } from 'src/app/model/post.interface';
import { Subscription } from 'rxjs';
import { Howl } from 'howler'

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.page.html',
  styleUrls: ['./comment-section.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class CommentSectionPage implements OnInit {
  @Input() post_id: string;
  @Input() user_id: string;
  commentForm: FormGroup;
  comments: Comment[] = [];
  loading: boolean = false;
  private pageNo: number = 1;
  private limit: number = 5;
  private commentsSub: Subscription;
  constructor(private feed: FeedService, private controller: ControllersService) { }

  ngOnInit() {
    this.commentForm = new FormGroup({
      comment: new FormControl(null)
    });
    this.getComments(this.post_id, this.pageNo, this.limit);
    this.commentsSub = this.feed.getCommentsListener().subscribe((res: Comment) => {
      if (res.post_id === this.post_id) {
        this.comments.push({
          firstName: localStorage.getItem('firstName'),
          lastName: localStorage.getItem('lastName'),
          profilePic: localStorage.getItem('profilePic'),
        })
        if (this.comments[0].comments)
          this.comments[0].comments.unshift({ comments: res.comment });
        else
          this.comments[0].comments = [{ comments: res.comment }];
      }

    })
  }

  ngOnDestroy() {
    this.commentsSub.unsubscribe();
  }

  getComments(post_id: string, pageNo: number, limit: number) {
    this.loading = true;
    this.feed.getComments(post_id, pageNo, limit).subscribe((response: any) => {
      response.data.forEach((data: any) => {
        this.comments.push({
          firstName: data.user.firstname,
          lastName: data.user.lastname,
          comments: data.comments,
          profilePic: data.user.profileImage ? data.user.profileImage : "https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-2048x1949-pq9uiebg.png"
        })
      })
      this.pageNo++;
      this.loading = false;
    }, error => {
      this.controller.toast(error.error.message ? error.error.message : "Error Fetching Comments", "toastbgRed")
      this.loading = false;
    })
  }

  onIonInfinite(ev: Event) {
    this.getComments(this.post_id, this.pageNo, this.limit);
    setTimeout(() => {
      (ev as InfiniteScrollCustomEvent).target.complete();
    }, 1000);
  }

  onComment() {
    if (this.commentForm.value.comment !== null) {
      this.feed.commentPost(this.commentForm.value.comment, this.user_id, this.post_id).subscribe((res: any) => {
        const comments: Comment = {
          post_id: this.post_id,
          comment: res.data.comments,
          totalComments: res.data.lengthOfComments,
        }
        this.feed.setComments(comments);
      });
    }
    this.commentForm.reset();
    const sound = new Howl({
      src: ['../../../assets/sounds/fb.mp3'],
      volume: 0.5,
    });
    sound.play();

  }

}
