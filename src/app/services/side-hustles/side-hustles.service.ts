import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SideHustlesService {

  constructor(private http:HttpClient) { }

  getSideHustles(page:number, limit:number){
    return this.http.get(`https://casehustle.vercel.app/api/jobs?page=${page}&limit=${limit}`);
  }
}
