import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Event } from './events/event.model';
import {Users} from './user.model';

const BACKEND_URL = environment.apiUrl + '/events/';

const BACKEND_URL1 = environment.apiUrl + '/user/';
@Injectable({ providedIn: 'root' })
export class EventsService {
  private events: Event[] = [];
  private users: Users[]=[];
  private eventsUpdated = new Subject<{ events: Event[]; eventCount: number }>();
 private usersUpdated = new Subject<{ users: Users[]; UserCount: number }>();
  constructor(private http: HttpClient, private router: Router) {}


getUsers() {
   
    this.http
      .get<{ message: string; users: any; maxUsers: number }>(
        BACKEND_URL1
      )
      .pipe(
        map(eventData => {
          return {
            users: eventData.users.map(event => {
              return {
                id: event.id,
                email:event.email,
                firstName:event.firstName,
                lastName:event.lastName,
                phoneNum:event.phoneNum
              };
            }),
            maxUsers: eventData.maxUsers
          };
        })
      )
      .subscribe(transformedEventData => {
        this.users = transformedEventData.users;
        this.usersUpdated.next({
          users: [...this.users],
          UserCount: transformedEventData.maxUsers
        });
      });
  }
  getEvents(eventsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${eventsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; events: any; maxEvents: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(eventData => {
          return {
            events: eventData.events.map(event => {
              return {
                title: event.title,
                content: event.content,
                id: event._id,
                imagePath: event.imagePath,
                startDate: event.startDate,
                endDate: event.endDate,
                category: event.category,
                creator: event.creator,
                is_private: event.is_private,
                max_users: event.max_users,
                eventFee: event.eventFee,
                eventManagerName: event.event_manager[0].name,
                eventManagerEmail: event.event_manager[0].email,
                eventManagerPhone: event.event_manager[0].phone,
                street: event.address[0].street,
                city: event.address[0].city,
                state: event.address[0].state,
                country: event.address[0].country,
                zipcode: event.address[0].zipcode,
                verify:event.verify
              };
            }),
            maxEvents: eventData.maxEvents
          };
        })
      )
      .subscribe(transformedEventData => {
        this.events = transformedEventData.events;
        this.eventsUpdated.next({
          events: [...this.events],
          eventCount: transformedEventData.maxEvents
        });
      });
  }

  getEventUpdateListener() {
    return this.eventsUpdated.asObservable();
  }
 getUserUpdateListener() {
    return this.usersUpdated.asObservable();
  }
  getEvent(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      creator: string;
      verify:boolean;
    }>(BACKEND_URL + id);
  }

  addEvent(title: string, content: string, image: File) {
    const eventData = new FormData();
    eventData.append('title', title);
    eventData.append('content', content);
    eventData.append('image', image, title);
    this.http
      .post<{ message: string; event: Event }>(
        BACKEND_URL,
        eventData
      )
      .subscribe(responseData => {
        this.router.navigate(['/']);
      });
  }

  updateEvent(id: string, title: string, content: string, image: File | string) {
    let eventData: Event | FormData;
    if (typeof image === 'object') {
      eventData = new FormData();
      eventData.append('id', id);
      eventData.append('title', title);
      eventData.append('content', content);
      eventData.append('image', image, title);
    } else {
      eventData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null,
        verify: false
      };
    }
    this.http
      .put(BACKEND_URL + id, eventData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }
  deleteEvent(eventId: string) {
    return this.http.delete(BACKEND_URL + eventId);
  }
   verifyEvent(eventId: string) {
   return this.http.put(BACKEND_URL + 'verify/' + eventId, eventId);
  }
   disableEvent(eventId: string) {
   return this.http.put(BACKEND_URL + 'disable/' + eventId, eventId);
  }
   disable(id:string){
  return this.http.put(BACKEND_URL1 + 'users/'+id,id);
  }

}
