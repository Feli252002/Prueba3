import { Component, OnInit, inject } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { Viaje } from 'src/app/interfaces/viaje';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-ver-viaje',
  templateUrl: './ver-viaje.component.html',
  styleUrls: ['./ver-viaje.component.scss'],
})
export class VerViajeComponent  implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  emailSvc = inject(EmailService);

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

  enviarComprobante(viaje: Viaje) {
    const email = this.user().email;
    const subject = 'Comprobante de viaje';
    const body = 'Gracias por agendar su hora, aqui esta su comprobante de viaje hacia: ' + viaje.region + `hacia la comuna de ` + viaje.comuna + `hora de viaje: ` + viaje.salida;
   
    this.emailSvc.enviarConfirmacion(email, subject, body).subscribe(response => {
       console.log('Email sent successfully!');
    }, error => {
       console.log('Error sending email:', error);
    });
   }

   async confirmComprobante(viaje: Viaje){
    this.utilsSvc.presentAlert({
      header: 'Reservar viaje',
      message: '¿Quieres reservar este viaje?',
      buttons: [
        {
          text: 'Cancelar'
        },{
          text: 'Si, reservar',
          handler:() => {
            this.enviarComprobante(viaje)
          }
        }
      ]
    });
  }
}
