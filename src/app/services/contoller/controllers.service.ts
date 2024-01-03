import { Injectable } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { ParentConfirmationPage } from 'src/app/components/user-auth/signup/parent-confirmation/parent-confirmation.page';


@Injectable({
  providedIn: 'root'
})
export class ControllersService {

  constructor(private toastCtrl: ToastController, private loadingCtrl: LoadingController, private modalController: ModalController) { }

  async toast(message: string, cssClass: string) {
    const toaster = await this.toastCtrl.create({
      message: message,
      duration: 2000,
      cssClass: cssClass
    })
    toaster.present();
  }

  async loading(message: string) {
    return await this.loadingCtrl.create({
      message: message,
      spinner: 'crescent',
    })
  }

  async parentsConfirmation() {
    const modal = await this.modalController.create({
      component: ParentConfirmationPage,
      cssClass: 'custom-modal-bottom',
      showBackdrop: false,
    });

    return await modal.present();
  }


  async closeModal() { // Corrected the method name to closeModal()
    const close: string = "Modal Removed";
    await this.modalController.dismiss(close);
  }

  

  // async takeVideo(){
  //     const result = await FilePicker.pickVideos({
  //       multiple: false,
  //     });
  //     const file = result.files[0].blob;
  //     console.log(file);

  //     const form = new FormData();
  //     form.append('file', file);
  //     this.http.post('http://localhost:4000/api/v1/post/myFeed',form).subscribe(response =>{
  //       console.log(response);
  //     });
  // }

  // async selectDocument(){
  //   const result = await FilePicker.pickFiles({
  //     multiple: false,
  //   });
  //   console.log(result);
  //   const file = result.files[0].blob;
  //   console.log(file);
  //   const form = new FormData();
  //   form.append('file', file);
  //   this.http.post('http://localhost:4000/api/v1/post/myFeed',form).subscribe(response =>{
  //     console.log(response);
  //   });
  // }
}
