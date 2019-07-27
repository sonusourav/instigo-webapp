import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomePageComponent } from './events/homepage/homepage.component';
import { AuthGuard } from './auth/auth.guard';
import {AdminGuard} from './auth/admin.guard';
import { AdminComponent } from './admin/admin.component';
import {LoginComponent} from './login/login.component';
const routes: Routes = [
  { path: '', component: HomePageComponent },
   { path: 'login', component: LoginComponent },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule'},
   { path: 'admin1', loadChildren: './admin/admin.module#AdminModule'},
  { path: 'admin', component: AdminComponent,canActivate: [AdminGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard,AdminGuard]
})
export class AppRoutingModule {}
