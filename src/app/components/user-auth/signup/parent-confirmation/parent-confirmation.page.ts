import { Component, ElementRef, OnInit, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { UserAuthService } from 'src/app/services/user-auth/user-auth.service';
import { ControllersService } from 'src/app/services/contoller/controllers.service';

@Component({
  selector: 'app-parent-confirmation',
  templateUrl: './parent-confirmation.page.html',
  styleUrls: ['./parent-confirmation.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule, ReactiveFormsModule]
})
export class ParentConfirmationPage implements OnInit {
  parentConfirmationForm: FormGroup = new FormGroup({});
  constructor(
    private controller: ControllersService, private authService: UserAuthService, private toasterCtrl: ToastController
  ) { }

  ngOnInit() {
    this.parentConfirmationForm = new FormGroup({
      guardianEmail: new FormControl(null, [Validators.required, Validators.email, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]),
      guardianPhone: new FormControl(null, [Validators.required, Validators.pattern(/^[0-9]+$/)]),
    });
  }

  onSave() {
    this.parentConfirmationForm.markAllAsTouched();
    if (this.parentConfirmationForm.valid) {
      this.authService.setGuardianInfo(this.parentConfirmationForm.value);
      this.controller.closeModal();
    }
    else{
      this.controller.toast("Please enter valid email and phone number","toastbgRed");
    }
  }

  closeModal(){
    this.controller.closeModal();
  }
}
