import { Injectable } from '@angular/core';
import Pusher from 'pusher-js';

@Injectable({
  providedIn: 'root'
})
export class PusherService {
  private pusher: Pusher;
  constructor() {

    this.pusher = new Pusher('0a8dd6c75efa8c042997', {
      cluster: 'ap2', // Replace with your Pusher cluster
      // encrypted: true // Set to true if using HTTPS
    });
   }

   getPusherInstance(): Pusher {
    return this.pusher;
  }
}
