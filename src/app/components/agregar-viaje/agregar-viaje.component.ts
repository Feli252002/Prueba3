import { Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user';
import { Viaje } from 'src/app/interfaces/viaje';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-agregar-viaje',
  templateUrl: './agregar-viaje.component.html',
  styleUrls: ['./agregar-viaje.component.scss'],
})
export class AgregarViajeComponent implements OnInit {

  @Input() viaje: Viaje

  formAdd = new FormGroup({
    id: new FormControl(''),
    region: new FormControl('', [Validators.required]),
    comuna: new FormControl('', [Validators.required]),
    capacidad: new FormControl(null, [Validators.required, Validators.min(1), Validators.max(4)]),
    salida: new FormControl(null, [Validators.required]),
    precio: new FormControl(null, [Validators.required, Validators.min(500)]),
    image: new FormControl('', [Validators.required]),
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  user = {} as User;

  ngOnInit() {

    this.user = this.utilsSvc.getFromLocalStorage('user');
    if (this.viaje) this.formAdd.setValue(this.viaje);

  }

  dismissModal(){
    this.utilsSvc.dismissModal();
  }

  async takeImage() {
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del vehiculo')).dataUrl;
    this.formAdd.controls.image.setValue(dataUrl);
  }

  submit() {
    if (this.formAdd.valid) {
      if (this.viaje) this.editarViaje();
      else this.crearViaje()
    }
  }

  async crearViaje() {
    let path = `users/${this.user.uid}/viajes`
    const loading = await this.utilsSvc.loading();
    await loading.present();
    let dataUrl = this.formAdd.value.image;
    let imagePath = `${this.user.uid}/${Date.now()}`;
    let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
    this.formAdd.controls.image.setValue(imageUrl);
    delete this.formAdd.value.id
    this.firebaseSvc.addDocument(path, this.formAdd.value).then(async res => {
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Viaje creado exitosamente',
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

  async editarViaje() {
    let path = `users/${this.user.uid}/viajes/${this.viaje.id}`
    const loading = await this.utilsSvc.loading();
    await loading.present();
    if (this.formAdd.value.image !== this.viaje.image) {
      let dataUrl = this.formAdd.value.image;
      let imagePath = await this.firebaseSvc.getFilePath(this.viaje.image);
      let imageUrl = await this.firebaseSvc.uploadImage(imagePath, dataUrl);
      this.formAdd.controls.image.setValue(imageUrl);
    }
    delete this.formAdd.value.id
    this.firebaseSvc.updateDocument(path, this.formAdd.value).then(async res => {
      this.utilsSvc.dismissModal({ success: true });
      this.utilsSvc.presentToast({
        message: 'Producto actualizado exitosamente',
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
