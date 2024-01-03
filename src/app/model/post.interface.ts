export interface Post{
    _id?: string;
    caption?:string;
    postImage?:string;
    firstName?:string;
    lastName?:string;
    userProfilePic?:string;
    createDate?:string;
    createTime?:string;
    likes?:number;
    comments?:number;
    postLiked?:boolean;
}

export interface Comment{
    comments?:any[];
    firstName?:string;
    lastName?:string;
    post_id?:string;
    totalComments?:number;
    comment?:string;
    profilePic?:string;
}