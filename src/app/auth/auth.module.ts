import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SignupComponent } from './signup/signup.component';
import { VemailComponent } from './vemail/vemail.component';
import { AngularMaterialModule } from '../angular-material.module';
import { AuthRoutingModule } from './auth-routing.module';
import { OAuthComponent } from './oauth/oauth.component';
import { CookieService } from 'ngx-cookie-service';
import { MatDialog,MatDialogRef } from '@angular/material';
@NgModule({
  declarations: [SignupComponent, OAuthComponent, VemailComponent],
  imports: [CommonModule, AngularMaterialModule, FormsModule, AuthRoutingModule],
  providers: [CookieService
 ]
})
export class AuthModule {}
