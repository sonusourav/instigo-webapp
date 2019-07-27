import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject, empty } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthData, authDataP, authDataNP } from './auth-data.model';
import { MatDialog,MatDialogRef } from '@angular/material';
import { ErrorComponent } from '../error/error.component';

const BACKEND_URL = 'http://localhost:3000' + '/users/';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private token: string;
  private tokenTimer: any;
  private userId: string;
  private admin = false;
  private adminId;
  private authStatusListener = new Subject<boolean>();
   private eventsUpdated = new Subject<{ events: any}>();
  constructor(private http: HttpClient, private router: Router, private dialog: MatDialog ){}

  getToken() {
    return this.token;
  }

  getIsAuth() {
    return this.isAuthenticated;
  }

  getUserId() {
    return this.userId;
  }
getAdminId(){
    return this.adminId;
    }
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string, name: string,isactive: boolean) {
    const authdata: authDataP | authDataNP = {email: email,
                                password: password,
                                name: name,
                                isactive: isactive
                                        };
    this.http.post<{message: string}>(BACKEND_URL + 'signUp', authdata).subscribe(
      response => {
        console.log(response);
        if(response.message === "success"){
                this.dialog.open(ErrorComponent, {data: {message: "Email Verification Link Sent" }});
            }
            if(response.message ==="failure@password do not match"){
                this.dialog.open(ErrorComponent, {data: {message: "Password do not match" }});
            }
        this.router.navigate(['/']);
      }
    );
  }

  emailVerify(id: string, userID: string) {
    const vemail = {
      id: id,
      userID: userID
    };
    console.log(vemail);
    return this.http.post<{message: string}>(BACKEND_URL + 'verify', vemail);
  }

  login(email: string, password: string) {
    const authdata: AuthData = { email: email, password: password };
    this.http
      .post<{ token: string; expiresIn: number; userId: string }>(
        BACKEND_URL + 'signin',
        authdata
      )
      .subscribe(
        (response:any) => {
          console.log(response);
          const token = response.token;
          this.token = token;
          if (token) {
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);
            this.isAuthenticated = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            const now = new Date();
            this.admin=response.admin;
            this.adminId=response.adminId;
            const expirationDate = new Date(
              now.getTime() + expiresInDuration * 1000
            );
            console.log(expirationDate);
            this.saveAuthData(token, expirationDate, this.userId);
              if(this.userId === this.adminId){
              this.admin=true;
              this.router.navigate(['/admin'],{queryParams:this.adminId}) }
            else{
            this.router.navigate(['/']);
            }
          }
          if(response.message === "failure@User Not found"){
                this.dialog.open(ErrorComponent, {data: {message: "User Not Found!!" }});
            }
            if(response.message ==="failure@password do not match"){
                this.dialog.open(ErrorComponent, {data: {message: "Password do not match" }});
            }
        }
      );
  }
  googleLogin() {
    window.location.href = (environment.apiUrl).slice(0,-3) + 'auth/google';
  }
  // http://socials-env.shbzuc3tkd.ap-south-1.elasticbeanstalk.com/auth/google'
  facebookLogin() {
    window.location.href = (environment.apiUrl).slice(0,-3) + 'auth/facebook';
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  getUserDetails(id: string) {
  return  this.http.get<{
            email: string;
            firstName: string;
          }>(BACKEND_URL + 'user-details/' + id);
  }
getEventUpdateListener() {
    return this.eventsUpdated.asObservable();
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
     this.admin = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private setAuthTimer(duration: number) {
    console.log('Setting timer: ' + duration);
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
     localStorage.removeItem('isAdmin');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    };
  }

  getContactNum(id: string) {
    return this.http.get<{
            phoneNum: string;
          }>(BACKEND_URL + 'user-phoneNum/' + id);
  }

  getUsers() {
      return  this.http.get<{
                message: string;
                users: any;
                count: any;
              }>(BACKEND_URL);
  }
}
