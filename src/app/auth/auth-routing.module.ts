import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup/signup.component';
import { VemailComponent } from './vemail/vemail.component';
import { OAuthComponent } from './oauth/oauth.component';

const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'oauth', component: OAuthComponent },
  { path: 'verify' , component: VemailComponent } ,
  
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
