import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Comment } from 'src/app/model/post.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private comments = new BehaviorSubject<Comment>({});
  constructor(private http:HttpClient) { }

  setComments(comment:Comment){
    this.comments.next(comment);
  }
  getCommentsListener(){
    return this.comments.asObservable();
  }
 
  
  post(form:FormData){
    return this.http.post(`https://casehustle.vercel.app/api/createFeed`, form);
  }

  getPosts(pageNo:number, limit:number){
    return this.http.get(`https://casehustle.vercel.app/api/feeds?page=${pageNo}&limit=${limit}`);
  }

  likePost(user_id:string, post_id:string){
    return this.http.put(`https://casehustle.vercel.app/api/likes`, {user_id, post_id});
  }

  getMyPosts(user_id:string, page:number, limit:number){
    return this.http.get(`https://casehustle.vercel.app/api/userFeed/${user_id}?page=${page}&limit=${limit}`);
  }

  commentPost(comments:string, user_id:string, post_id:string){
    return this.http.put(`https://casehustle.vercel.app/api/createComments`, {comments, user_id, post_id});
  }

  getComments(post_id:string,page:number, limit:number){
    return this.http.get(`https://casehustle.vercel.app/api/comments/${post_id}?page=${page}&limit=${limit}`);
  }

}
