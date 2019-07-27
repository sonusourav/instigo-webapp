import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialogModule } from '@angular/material/dialog';
import {EventsComponent} from './admin/events/events.component';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from './angular-material.module';
import { EventsModule } from './events/events.module';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FormsModule } from '@angular/forms';
import { JwSocialButtonsModule } from 'jw-angular-social-buttons';
import { DialogBoxComponent } from './events/dialog-box/dialog-box.component';
import { AdminComponent } from './admin/admin.component';
import { MatTableModule } from '@angular/material';
import { MatIconModule } from '@angular/material'
import { MatPaginatorModule } from '@angular/material';
import { MatSortModule } from '@angular/material';
import {LoginComponent} from './login/login.component';
import { MatDialog,MatDialogRef } from '@angular/material';
@NgModule({
  declarations: [
    AppComponent,
     AdminComponent,
    HeaderComponent,
    FooterComponent,
    ErrorComponent,
     LoginComponent,
    EventsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    EventsModule,
    MDBBootstrapModule.forRoot(),
    JwSocialButtonsModule,
    MatDialogModule,
     MatTableModule,
     MatIconModule ,
     MatPaginatorModule,
     MatSortModule
  ],
  exports: [LoginComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    {provide: MatDialogRef, useValue: LoginComponent}
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent, DialogBoxComponent,EventsComponent,LoginComponent]
})
export class AppModule {}
