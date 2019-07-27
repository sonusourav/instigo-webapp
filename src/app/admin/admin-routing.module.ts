import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdminGuard} from '../auth/admin.guard';
import { DatatableslibraryComponent } from './datatables/datatables.component';
import { EventsComponent } from './events/events.component';
import {EventTableComponent} from './event-table/event-table.component';
import {ApproveComponent} from './approve/approve.component';

const routes: Routes = [
   { path: 'approve', component: ApproveComponent,canActivate: [AdminGuard]  },
    { path: 'use1', component:DatatableslibraryComponent,canActivate: [AdminGuard]},
    { path: 'event-table', component:EventTableComponent,canActivate: [AdminGuard] }
    ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}