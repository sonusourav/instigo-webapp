import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-oauth',
  templateUrl: './oauth.component.html',
  styleUrls: ['./oauth.component.css']
})
export class  OAuthComponent implements OnInit {

  private responseData: any;
  private token: string;
  private userId: string;

  constructor(public authService: AuthService, private cookieService: CookieService, private router: Router,  private activatedRoute: ActivatedRoute ) { }
  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      this.responseData  = JSON.parse(params.token);
    });
    console.log(this.responseData);
    const expiresInDuration = this.responseData.expiresIn;
    this.token = this.responseData.token;
    this.userId = this.responseData.userId;
    console.log(this.responseData.token);
    console.log(this.responseData.userId);
    console.log(this.responseData.expiresIn);
    const now = new Date();
    const expirationDate = new Date(
      now.getTime() + expiresInDuration * 1000
    );
    this.saveAuthData(this.token, expirationDate, this.userId);
    this.authService.autoAuthUser();
    this.router.navigate(['/']);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }
}
