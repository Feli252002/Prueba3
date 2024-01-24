import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  formLogIn = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
  }

  async submit(){
    if(this.formLogIn.valid){
      const loading = await this.utilsSvc.loading();
      await loading.present();
      this.firebaseSvc.signIn(this.formLogIn.value as User).then(res =>{
        this.getUserInfo(res.user.uid);
      }).catch(error =>{
        console.log(error);
        this.utilsSvc.presentToast({
          message: 'Correo/usuario o contraseña incorrectas',
          duration: 2000,
          position: 'bottom',
          icon: 'alert-circle-outline'
        })
      }).finally(() =>{
        loading.dismiss();  
      })
    }
  }

  async getUserInfo(uid: string){
    if (this.formLogIn.valid){
      const loading = await this.utilsSvc.loading();
      await loading.present();
      let path = `users/${uid}`;
      this.firebaseSvc.getDocument(path).then((user: User) =>{
        this.utilsSvc.saveInLocalStorage('user', user);
        this.utilsSvc.routerLink('/home/ver-viaje');
        this.formLogIn.reset();
        this.utilsSvc.presentToast({
          message: `Bienvenido ${user.name}`,
          duration: 2000,
          position: 'bottom',
          icon: 'person-circle-outline'
        })
      }).catch(error =>{
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2000,
          position: 'bottom',
          icon: 'alert-circle-outline'
        })
      }).finally(() =>{
        loading.dismiss();
      })
    }
  }

}
