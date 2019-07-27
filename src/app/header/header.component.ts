import { Component, OnInit, OnDestroy, ElementRef, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatPaginator, MatSort ,MatTable,MatTableDataSource,MatIcon,MatDialog, MatDialogConfig } from '@angular/material';
import { AuthService } from '../auth/auth.service';
import { authDataNP, authDataP } from '../auth/auth-data.model';
import { EventsService } from '../events/events.service';
import { Router } from '@angular/router';
import { HeaderServices } from './header.services';
import {LoginComponent} from '../login/login.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  userId: string;
  user: any;
  invitations: {accepted: boolean, from: string, eventId: string}[] = [];
  private inviteListenerSubs: Subscription;
  private authListenerSubs: Subscription;
  

  constructor(private authService: AuthService, private eventsService:EventsService, private router: Router, private headerService: HeaderServices ,private dialog: MatDialog) {}

  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
      });
      this.userId = this.authService.getUserId();
      
      this.inviteListenerSubs = this.headerService.getInvitationsUpdateListener()
        .subscribe(data => {
          this.invitations = data.invitations;
          console.log(this.invitations);
        })      
  }

  accept(invitation) {
    const data = {eventId: invitation.eventID, userId: this.userId, invitation: invitation};
    this.headerService.acceptInvitation(data,invitation);
    
}

  reject(invitation) {
    console.log(invitation);
    const data = {invitation: invitation, userId: this.userId};
    this.headerService.rejectInvitation(data);
  }

  onLogout() {
    this.authService.logout();
  }
onclic() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose =false;
    dialogConfig.autoFocus = true;
    dialogConfig.width ="25%";
    this.dialog.open(LoginComponent,dialogConfig);
  }
  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }
}
