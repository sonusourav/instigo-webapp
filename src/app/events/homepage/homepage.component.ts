import { Component, OnInit, OnDestroy } from '@angular/core';
import {LoginComponent} from '../../login/login.component';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';
import { MatPaginator, MatSort ,MatTable,MatTableDataSource,MatIcon,MatDialog, MatDialogConfig } from '@angular/material';
import { Event } from '../event.model';
import { EventsService } from '../events.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomePageComponent implements OnInit, OnDestroy {
  // events = [
  //   { title: "First Event", content: "This is the first event's content" },
  //   { title: "Second Event", content: "This is the second event's content" },
  //   { title: "Third Event", content: "This is the third event's content" }
  // ];
  events: Event[] = [];
  isLoading = false;
  totalEvents = 0;
  eventsPerPage = 9;
  currentPage = 1;
  pageSizeOptions = [9, 18, 27];
  userIsAuthenticated = false;
  userId: string;
  private eventsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public eventsService: EventsService,
    private authService: AuthService,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.isLoading = true;
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
public isBlockedUser(currentUserId, blockedUserIds): boolean {
    
    return blockedUserIds.find(id => id == currentUserId) != undefined;
}
onclic() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose =true;
    dialogConfig.autoFocus = true;
    dialogConfig.width ="25%";
    this.dialog.open(LoginComponent,dialogConfig);
  }
  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
