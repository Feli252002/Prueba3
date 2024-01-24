import { Component, inject } from '@angular/core';
import { User } from 'firebase/auth';
import { AgregarViajeComponent } from 'src/app/components/agregar-viaje/agregar-viaje.component';
import { Viaje } from 'src/app/interfaces/viaje';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user(): User{
    return this.utilsSvc.getFromLocalStorage('user')
  }

  signOut(){
    this.firebaseSvc.signOut();
  }
  
  addUpdateViaje() {
    this.utilsSvc.presentModal({
      component: AgregarViajeComponent
    })
  }  

}
