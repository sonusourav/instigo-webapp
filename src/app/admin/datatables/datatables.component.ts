import { Component, OnDestroy,ElementRef, ViewChild, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Subject } from 'rxjs';
import {AppModule} from '../../app.module';
import { Subscription } from 'rxjs';
import {Users} from '../user.model';
import { MatPaginator, MatSort ,MatTable,MatTableDataSource,MatIcon,MatDialog, MatDialogConfig } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { EventsService } from '../events.service';
import { AuthService } from '../../auth/auth.service';
@Component({
  selector: 'app-datatableslibrary',
  templateUrl: './datatables.component.html'
})
export class DatatableslibraryComponent implements OnInit, OnDestroy {
@ViewChild(MatSort) sort: MatSort;
@ViewChild(MatPaginator) paginator: MatPaginator;
 
listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['firstName', 'email', 'mobile', 'city', 'LastName','actions'];
  searchKey: string;
  users: any[] = [];
  userId:string;
  private eventsSub: Subscription;
   

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */

  totalUsers =0; 
  constructor(private http: HttpClient,
   private dialog: MatDialog,
    public eventsService: EventsService,
     private authService: AuthService) {
  }
  ngOnInit() {
this.userId=this.authService.getUserId();
this.eventsService.getUsers();
 this.eventsSub = this.eventsService
      .getUserUpdateListener()
      .subscribe((eventData: { users: Users[]; UserCount: number }) => {
        this.totalUsers = eventData.UserCount;
        this.users = eventData.users;
        console.log(this.users);
        this.listData= new MatTableDataSource(this.users);
        this.listData.sort = this.sort;
        this.listData.paginator = this.paginator;
      });

}

ondisable(email:string) {
                   this.eventsService.disable(email).subscribe(() => {
      this.eventsService.getUsers();
    });
}

onSearchClear() {
    this.searchKey = "";
    this.applyFilter();
  }

  applyFilter() {
    this.listData.filter = this.searchKey.trim().toLowerCase();
  }


 
 ngOnDestroy() {
    this.eventsSub.unsubscribe();
  }
  }
