import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { EventsService } from '../events/events.service';
import { AuthService } from '../auth/auth.service';
import { authDataP, authDataNP } from '../auth/auth-data.model';


const BACKEND_URL = environment.apiUrl + '/header/';
@Injectable({ providedIn: 'root' })

export class HeaderServices {
    private invitations: any = [];
    private invitationsUpdated = new Subject<{invitations : {accepted: boolean, from: string, eventId: string}[] }>();
    user: authDataP | authDataNP;
    constructor(private eventService: EventsService, private authService: AuthService) {}
    
    
    getInvitationsUpdateListener() {
        return this.invitationsUpdated.asObservable();
    }

    rejectInvitation(data) {
        this.eventService.rejectInvitation(data)
      .subscribe(result => { 
        if(result.delete = true) {
        this.invitations.splice(this.invitations.indexOf(data.invitation),1);
        }
        this.invitationsUpdated.next({
            invitations: this.invitations
        })
      })
    }
    
    acceptInvitation(data, invitation) {
        this.eventService.addUserToEvent(data)
            .subscribe(response => {
            console.log(response);
            if(response.accepted = true) {
                this.invitations.splice(this.invitations.indexOf(invitation),1);
            }
            this.invitationsUpdated.next({
                invitations: this.invitations
            })
        });
    }


}