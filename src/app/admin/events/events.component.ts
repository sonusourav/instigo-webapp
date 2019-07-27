import { NgModule,Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { Event } from './event.model';
import {Users} from '../user.model';

import { EventsService } from '../events.service';
import { AuthService } from '../../auth/auth.service';
import { MatDialog ,MatToolbar, MatDialogRef,MatIcon } from "@angular/material";
import { ErrorComponent } from "../../error/error.component";
@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit, OnDestroy {
  // events = [
  //   { title: "First Event", content: "This is the first event's content" },
  //   { title: "Second Event", content: "This is the second event's content" },
  //   { title: "Third Event", content: "This is the third event's content" }
  // ];
  events: Event[] = [];
  pending=0;
  users:Users[]=[];
  isLoading = false;
  totalEvents = 0;
  totalUsers =0;
  eventsPerPage = 9;
  currentPage = 1;
  pageSizeOptions = [9, 18, 27];
  userIsAuthenticated = false;
  userId: string;
  private eventsSub: Subscription;
  private authStatusSub: Subscription;
  userIsAdmin;
 
  constructor(
    public eventsService: EventsService,
    private authService: AuthService,
    public dialogRef: MatDialogRef<EventsComponent> 
  ) {}

  ngOnInit() {
     this.isLoading = true;
    this.eventsService.getEvents(this.eventsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.eventsSub = this.eventsService
      .getEventUpdateListener()
      .subscribe((eventData: { events: Event[]; eventCount: number }) => {
        this.isLoading = false;
        this.totalEvents = eventData.eventCount;
        this.events = eventData.events;
      });
      this.userIsAuthenticated= this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
      console.log(this.pending);
  }
 
  
  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.eventsPerPage = pageData.pageSize;
    this.eventsService.getEvents(this.eventsPerPage, this.currentPage);
  }

  onDelete(eventId: string) {
    this.isLoading = true;
    this.eventsService.deleteEvent(eventId).subscribe(() => {
      this.eventsService.getEvents(this.eventsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }
    onverify(eventId: string){
                  
                    this.isLoading = true;
                   this.eventsService.verifyEvent(eventId).subscribe(() => {
      this.eventsService.getEvents(this.eventsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
    }
    ondisable(eventId: string){
                  
                    this.isLoading = true;
                   this.eventsService.disableEvent(eventId).subscribe(() => {
      this.eventsService.getEvents(this.eventsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });

    }
    onClose() {
    this.dialogRef.close();
}
  ngOnDestroy() {
    this.eventsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
