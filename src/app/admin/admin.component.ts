import { NgModule,Component, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { Event } from './events/event.model';
import {Users} from './user.model';
import { EventsService } from './events.service';
import { AuthService } from '../auth/auth.service';
import { MatDialog,MatDialogConfig } from "@angular/material";
import { ErrorComponent } from "../error/error.component";
import {EventsComponent} from "./events/events.component";
@Component({
  selector: 'app-admin',

  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css',
  './sb-admin.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  // events = [
  //   { title: "First Event", content: "This is the first event's content" },
  //   { title: "Second Event", content: "This is the second event's content" },
  //   { title: "Third Event", content: "This is the third event's content" }
  // ];
  events: Event[] = [];
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
  private userIsAdmin;
 
  constructor(
    public eventsService: EventsService,
     public dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.eventsService.getUsers();
    this.eventsSub = this.eventsService
      .getUserUpdateListener()
      .subscribe((eventData: { users: Users[]; UserCount: number }) => {
        this.isLoading = false;
        this.totalUsers = eventData.UserCount;
        this.users = eventData.users;
      });
    this.eventsService.getEvents(this.eventsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.eventsSub = this.eventsService
      .getEventUpdateListener()
      .subscribe((eventData: { events: Event[]; eventCount: number }) => {
        this.isLoading = false;
        this.totalEvents = eventData.eventCount;
        this.events = eventData.events;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
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

  onclic() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "60%";
    this.dialog.open(EventsComponent,dialogConfig);
  }

    onverify(eventId: string){
                    this.isLoading = true;
                   this.eventsService.verifyEvent(eventId).subscribe(() => {
      this.eventsService.getEvents(this.eventsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
    }
  ngOnDestroy() {
    this.eventsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
