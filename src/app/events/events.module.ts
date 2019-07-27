import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import {HomePageComponent } from './homepage/homepage.component';
import { AngularMaterialModule } from '../angular-material.module';
import { DialogBoxComponent } from './dialog-box/dialog-box.component';

import { AgmCoreModule } from '@agm/core';


@NgModule({
  declarations: [
    HomePageComponent,
    DialogBoxComponent
    ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDMFkRvTzv6nMQBqUeF2KBWnIPI7ppo_bc'
    }),
    MatDialogModule,
    FormsModule
  ]
})
export class EventsModule {}
