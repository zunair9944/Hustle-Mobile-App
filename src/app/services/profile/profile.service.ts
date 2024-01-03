import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ControllersService } from '../contoller/controllers.service';
import { Router } from '@angular/router';
import { User } from 'src/app/model/user.interface';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private userListener = new Subject<User>();

  constructor(private http: HttpClient, private controller: ControllersService, private router: Router) { }

  getUser() {
    return this.userListener.asObservable();
  }

  async updateProfile(userId: string, updateForm: FormGroup) {
    const form = new FormData();
    form.append('_id', userId);
    form.append('firstname', updateForm.value.firstName);
    form.append('lastname', updateForm.value.lastName);
    form.append('accountname', updateForm.value.accountName);
    form.append('password', updateForm.value.password);
    form.append('DOB', updateForm.value.dateOfBirth);
    form.append('profilePic', updateForm.get('profilePic').value);

    const loading = await this.controller.loading('Updating Profile');
    await loading.present();
    this.http.put(`https://casehustle.vercel.app/api/userUpdate`, form).subscribe(async (response: any) => {
      this.userListener.next({
        _id: response.data._id,
        accountName: response.data.accountname,
        firstName: response.data.firstname,
        lastName: response.data.lastname,
        dateOfBirth: response.data.DOB,
        profilePic: response.data.profileImage,
      });
      localStorage.setItem('accountName', response.data.accountname);
      localStorage.setItem('firstName', response.data.firstname);
      localStorage.setItem('lastName', response.data.lastname);
      localStorage.setItem('DOB', response.data.DOB);
      localStorage.setItem('profilePic', response.data.profileImage?response.data.profileImage: "'https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-2048x1949-pq9uiebg.png'");
      this.controller.toast(response.message, 'toastbgOrange');
      await loading.dismiss();
      this.router.navigate(['/tabs/profile']);
    }, async error => {
      await loading.dismiss();
      this.controller.toast(error.error.message ? error.error.message : "Connection Timed Out", 'toastbgRed');
    })
  }
}
