export interface Message{
    content?:string;
    isSender?:boolean;
    sender_id?:string;
    receiver_id?:string;
    createdAt?:string;
}

export interface LastMsg{
    content?:string;
    _id?:string;
}