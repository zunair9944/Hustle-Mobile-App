import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ControllersService } from '../contoller/controllers.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private guardianInfoListener = new Subject<string>();
  private isAuthenticated = false;

  constructor(private http: HttpClient, private controller: ControllersService, private router: Router) { }

  setGuardianInfo(guardianInfo: string) {
    this.guardianInfoListener.next(guardianInfo);
  }
  getIsAuthenticated() {
    return this.isAuthenticated;
  }
  getGuardianInfoListener() {
    return this.guardianInfoListener.asObservable();
  }

  signup(signUpForm: any) {
    const form = {
      firstname: signUpForm.firstName,
      lastname: signUpForm.lastName,
      accountname: signUpForm.accountName,
      password: signUpForm.password,
      DOB: signUpForm.dateOfBirth,
      guardianEmail: signUpForm.guardianEmail,
      guardianPhone: signUpForm.guardianPhone,
      parentConfirmation: signUpForm.parentsConfirmation
    }
    return this.http.post(`https://casehustle.vercel.app/api/signUp`, form);
  }

  async login(signInData: any) {
    const userDetails = {
      accountname: signInData.accountName,
      password: signInData.password
    }
    const loading = await this.controller.loading('Logging In');
    await loading.present();
    this.http.post(`https://casehustle.vercel.app/api/signIn`, userDetails).subscribe(async (response: any) => {
      this.saveAuthData(response.token, response.data.accountname, response.data.firstname, response.data.lastname, response.data.totalReviews, response.data.DOB, response.data._id, response.data.profileImage? response.data.profileImage : 'https://static-00.iconduck.com/assets.00/avatar-default-symbolic-icon-2048x1949-pq9uiebg.png');
      this.isAuthenticated = true;
      this.router.navigate(['/tabs'])
      await loading.dismiss();
    }, async (error) => {
      await loading.dismiss();
      this.controller.toast(error.error.message ? error.error.message : "Connection Timed Out", "toastbgRed")
    })
  }

  async logout() {
    this.clearAuthData();
    this.isAuthenticated = false;
    const loading = await this.controller.loading('Logging Out');
    await loading.present();
    setTimeout(async () => {
      await loading.dismiss();
    }, 2000);
    this.router.navigate(['/user-auth/login'])
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation)
      return;
    this.isAuthenticated = true;
    this.router.navigate(['/tabs']);
  }

  private saveAuthData(token: string, accountName: string, firstName: string, lastName: string, reviews: number, dateOfBirth: string, _id: string,profilePic:string) {
    localStorage.setItem('token', token);
    localStorage.setItem('_id', _id);
    localStorage.setItem('accountName', accountName);
    localStorage.setItem('firstName', firstName);
    localStorage.setItem('lastName', lastName);
    localStorage.setItem('reviews', reviews.toString());
    localStorage.setItem('dateOfBirth', dateOfBirth);
    localStorage.setItem('profilePic', profilePic);
  }
  private clearAuthData() {
    localStorage.clear();
  }
  private getAuthData() {
    const token = localStorage.getItem('token');
    const _id = localStorage.getItem('_id');
    const accountName = localStorage.getItem('accountName');
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');
    const reviews = localStorage.getItem('reviews');
    const dateOfBirth = localStorage.getItem('dateOfBirth');

    if (!token || !_id || !accountName || !firstName || !lastName || !reviews || !dateOfBirth)
      return null;
    return {
      token: token,
      _id: _id,
      accountName: accountName,
      firstName: firstName,
      lastName: lastName,
      reviews: reviews,
      dateOfBirth: dateOfBirth
    }
  }
}
