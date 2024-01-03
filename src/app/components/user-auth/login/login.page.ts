import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { ControllersService } from 'src/app/services/contoller/controllers.service';
import { UserAuthService } from 'src/app/services/user-auth/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule,RouterModule,ReactiveFormsModule]
})
export class LoginPage implements OnInit {
  passwordVisible = false;
  loginForm:FormGroup = new FormGroup({});
  constructor(private controller:ControllersService,private userAuthService:UserAuthService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      accountName: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required)
    });
  }

  onLogin(){
    this.loginForm.markAllAsTouched();
    if(this.loginForm.valid){
      this.userAuthService.login(this.loginForm.value);
    }
    else{
      this.controller.toast("Please enter valid credentials","toastbgRed");
    }
  }

}
