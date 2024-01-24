import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

import { AgregarViajeComponent } from 'src/app/components/agregar-viaje/agregar-viaje.component';
import { MisViajeComponent } from 'src/app/components/mis-viaje/mis-viaje.component';
import { VerViajeComponent } from 'src/app/components/ver-viaje/ver-viaje.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage,
    children: [
      /* COMPONENTES DE TABS */
      {
        path: 'agregar-viaje',
        component: AgregarViajeComponent
      },
      {
        path: 'mis-viaje',
        component: MisViajeComponent
      },
      {
        path: 'ver-viaje',
        component: VerViajeComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
