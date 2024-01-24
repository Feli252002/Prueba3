import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  formResetPassword = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  })

  ngOnInit() {
  }

  async submit(){
    if (this.formResetPassword.valid){
      const loading = await this.utilsSvc.loading();
      await loading.present();
      this.firebaseSvc.sendRecoveryEmail(this.formResetPassword.value.email).then(res =>{
        this.utilsSvc.presentToast({
          message: 'Correo de recuperación enviado',
          duration: 2000,
          position: 'bottom',
          icon: 'mail-outline'
        })
        this.utilsSvc.routerLink('/login');
        this.formResetPassword.reset();
      }).catch(error =>{
        console.log(error)
        this.utilsSvc.presentToast({
          message: 'Correo no registrado',
          duration: 2000,
          position: 'bottom',
          icon: 'alert-circle-outline'
        })
      }).finally(() => {
        loading.dismiss();
      })
    }
  }

}
