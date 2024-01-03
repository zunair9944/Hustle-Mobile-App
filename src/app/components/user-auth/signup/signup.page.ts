import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Router, RouterModule } from '@angular/router';
import { UserAuthService } from 'src/app/services/user-auth/user-auth.service';
import { Subscription } from 'rxjs';
import { ControllersService } from 'src/app/services/contoller/controllers.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, ReactiveFormsModule]
})
export class SignupPage implements OnInit {
  passwordVisible = false;
  passwordVisibleC = false;
  signupForm: FormGroup = new FormGroup({});
  signUpButton: boolean = false;
  private guardianInfoSub: Subscription = new Subscription();

  constructor(private controller: ControllersService, private userAuthService: UserAuthService, private router: Router) { }

  ngOnInit() {
    this.signupForm = new FormGroup({
      firstName: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/)]),
      lastName: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Za-z]+(?: [A-Za-z]+)*$/)]),
      dateOfBirth: new FormControl(null, Validators.required),
      accountName: new FormControl(null, Validators.required),
      password: new FormControl(null, [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)]),
      parentsConfirmation: new FormControl(false, Validators.required),
      confirmPassword: new FormControl(null, [Validators.required]),
      privacyPolicy: new FormControl(null, Validators.requiredTrue),
    });
  }

  async onSignUp() {
    this.signupForm.markAllAsTouched();
    if (this.signupForm.valid) {
      if (this.signupForm.value.password !== this.signupForm.value.confirmPassword) {
        this.controller.toast("Password and Confirm Password should match", "toastbgRed");
      }
      else {
        if (this.signupForm.value.parentsConfirmation === true) {
          this.controller.parentsConfirmation();
          this.guardianInfoSub = this.userAuthService.getGuardianInfoListener().subscribe((guardianInfo: any) => {
            this.signupForm.addControl('guardianEmail', new FormControl(guardianInfo.guardianEmail, [Validators.required, Validators.email, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]));
            this.signupForm.addControl('guardianPhone', new FormControl(guardianInfo.guardianPhone, Validators.required));
            this.sendToService();
          })
        }
        else {
          if (this.signupForm.contains('guardianEmail'))
            this.signupForm.removeControl('guardianEmail');
          if (this.signupForm.contains('guardianPhone'))
            this.signupForm.removeControl('guardianPhone');
          this.sendToService();
        }
      }
    }
    else {
      this.controller.toast("Please enter valid details and accept policy", "toastbgRed");
    }
  }

  async sendToService() {
    const loading = await this.controller.loading("Signing Up...");
    await loading.present();
    this.userAuthService.signup(this.signupForm.value).subscribe(async (res) => {
      this.signupForm.reset();
      await loading.dismiss();
      this.controller.toast("Signed Up successfully", "toastbgOrange");
      this.router.navigate(['/user-auth/login']);
    }, error => {
      loading.dismiss();
      this.controller.toast(error.error.message? error.error.message : 'Connection Timed Out', "toastbgRed");
    });
  }
  ngOnDestroy() {
    this.guardianInfoSub?.unsubscribe();
  }
}
