import { Component, OnInit, inject } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { Viaje } from 'src/app/interfaces/viaje';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AgregarViajeComponent } from '../agregar-viaje/agregar-viaje.component';

@Component({
  selector: 'app-mis-viaje',
  templateUrl: './mis-viaje.component.html',
  styleUrls: ['./mis-viaje.component.scss'],
})
export class MisViajeComponent  implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  viajes: Viaje[] = []; 


  ngOnInit() {}

  user(): User{
    return this.utilsSvc.getFromLocalStorage('user')
  }

  ionViewWillEnter(){
    this.getViaje();
  }

  getViaje(){
    let path = `users/${this.user().uid}/viajes`;
    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) =>{
        console.log(res);
        this.viajes = res;
        sub.unsubscribe();
      }
    })
  }

  async confirmEliminarV(viaje: Viaje){
    this.utilsSvc.presentAlert({
      header: 'Eliminar viaje',
      message: '¿Quieres eliminar este viaje?',
      buttons: [
        {
          text: 'Cancelar'
        },{
          text: 'Si, eliminar',
          handler:() => {
            this.eliminarViaje(viaje)
          }
        }
      ]
    });
  }

  async addUpdateViaje(viaje?: Viaje) {
    let succes = await this.utilsSvc.presentModal({
      component: AgregarViajeComponent,
      componentProps: { viaje }
    })
    if(succes) this.getViaje();
  }

  async eliminarViaje(viaje: Viaje) {
    let path = `users/${this.user().uid}/viajes/${viaje.id}`
    const loading = await this.utilsSvc.loading();
    await loading.present();
    let imagePath = await this.firebaseSvc.getFilePath(viaje.image);
    await this.firebaseSvc.deleteFile(imagePath);
    this.firebaseSvc.deleteDocument(path).then(async res => {
      this.viajes = this.viajes.filter(v => v.id !== viaje.id);
      this.utilsSvc.presentToast({
        message: 'Producto eliminado exitosamente',
        duration: 2000,
        position: 'bottom',
        icon: 'checkmark-circle-outline'
      })
    }).catch(error => {
      console.log(error);
      this.utilsSvc.presentToast({
        message: 'Viaje ya se encuentra agregado',
        duration: 2000,
        position: 'bottom',
        icon: 'alert-circle-outline'
      })
    }).finally(() => {
      loading.dismiss();
    })
  }

}

