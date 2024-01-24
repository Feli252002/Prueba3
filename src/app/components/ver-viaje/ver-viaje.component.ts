import { Component, OnInit, inject } from '@angular/core';
import { User } from 'src/app/interfaces/user';
import { Viaje } from 'src/app/interfaces/viaje';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-ver-viaje',
  templateUrl: './ver-viaje.component.html',
  styleUrls: ['./ver-viaje.component.scss'],
})
export class VerViajeComponent  implements OnInit {

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
}
