import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatDialog } from "@angular/material";
import { MatTableModule } from '@angular/material';
import {MatDialogModule} from '@angular/material/dialog';
import { AngularMaterialModule } from '../angular-material.module';
import {AdminRoutingModule} from './admin-routing.module';
import {ApproveComponent} from './approve/approve.component';
import { FormsModule } from '@angular/forms';
import {EventTableComponent} from './event-table/event-table.component';
import {DatatableslibraryComponent} from './datatables/datatables.component';


@NgModule({
  declarations: [ApproveComponent,EventTableComponent,DatatableslibraryComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    MatDialogModule,
    FormsModule,
    MatTableModule,
    AdminRoutingModule
  ]
})
export class AdminModule {}
