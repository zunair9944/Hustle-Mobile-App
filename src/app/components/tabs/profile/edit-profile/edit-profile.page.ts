import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ControllersService } from 'src/app/services/contoller/controllers.service';
import { UserAuthService } from 'src/app/services/user-auth/user-auth.service';
import { User } from 'src/app/model/user.interface';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule]
})
export class EditProfilePage implements OnInit {
  passwordVisible = false;
  passwordVisibleC = false;
  updateForm: FormGroup = new FormGroup({});
  user: User = {};
  profilePicImage: string = '/assets/icon/user-circle-avatar.png';

  constructor(private controller: ControllersService, private userAuthService: UserAuthService, private router: Router, private profileService: ProfileService) { }

  ngOnInit() {
    this.updateForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/)]),
      lastName: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/)]),
      dateOfBirth: new FormControl(null, Validators.required),
      accountName: new FormControl(null, Validators.required),
      password: new FormControl(null, [Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
      confirmPassword: new FormControl(null),
      profilePic: new FormControl(null)
    });
  }

  ionViewWillEnter(){
    this.user = {
      _id: localStorage.getItem('_id'),
      firstName: localStorage.getItem('firstName'),
      lastName: localStorage.getItem('lastName'),
      accountName: localStorage.getItem('accountName'),
      dateOfBirth: localStorage.getItem('dateOfBirth'),
      reviews: Number(localStorage.getItem('reviews')),
      profilePic: localStorage.getItem('profilePic'),
    };
    this.profilePicImage = this.user.profilePic;
  }

  async updateProfile() {
    this.updateForm.markAllAsTouched();
    if (this.updateForm.valid) {
      this.profileService.updateProfile(this.user._id, this.updateForm);
    }
    else {
      this.controller.toast("Please enter valid details and accept policy", "toastbgRed");
    }
  }

  async sendToService() {
    const loading = await this.controller.loading("Signing Up...");
    await loading.present();
    this.userAuthService.signup(this.updateForm.value).subscribe(async (res) => {
      this.updateForm.reset();
      await loading.dismiss();
      this.controller.toast("Signed Up successfully", "toastbgOrange");
      this.router.navigate(['/user-auth/login']);
    }, error => {
      loading.dismiss();
      this.controller.toast(error.error.message ? error.error.message : 'Connection Timed Out', "toastbgRed");
    });
  }


  onProfilePic(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.updateForm.patchValue({ profilePic: file });
    this.updateForm.get("profilePic").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.profilePicImage = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
}
