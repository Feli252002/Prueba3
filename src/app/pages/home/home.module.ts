import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';


import { AgregarViajeComponent } from 'src/app/components/agregar-viaje/agregar-viaje.component';
import { MisViajeComponent } from 'src/app/components/mis-viaje/mis-viaje.component';
import { VerViajeComponent } from 'src/app/components/ver-viaje/ver-viaje.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, AgregarViajeComponent, MisViajeComponent, VerViajeComponent]
})
export class HomePageModule {}
