import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';
import { Event } from './event.model';
import { EventTBA } from './eventTBA.model';

const BACKEND_URL = environment.apiUrl + '/events/';

@Injectable({ providedIn: 'root' })
export class EventsService {
  private events: Event[] = [];
  private eventTBA: EventTBA;
  private eventsUpdated = new Subject<{ events: Event[]; eventCount: number }>();
  private eventTBAUpdated = new Subject<{ eventTBA: EventTBA }>();
  public dialogBoxEventId;

  constructor(private http: HttpClient, private router: Router) {}

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
                 blocked_users:event.blocked_users,
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

  getEvent(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      imagePath: string;
      startDate: string;
      endDate: string;
      category: string;
      creator: string;
      address: {
        street: string,
        city: string,
        state: string,
        country: string,
        zipcode: string
      };
      max_users: Number;
      eventFee: Number;
      event_manager: {
        name: string,
        email: string,
        phone: string
      };
      is_private: Boolean;
       verify:Boolean;
    }>(BACKEND_URL + id);
  }

  addUserToEvent(data: any) {
    return this.http
              .post<{ accepted: boolean ,message: string }>(
                BACKEND_URL+ 'addusertoevent',
                data
              );
  }

  rejectInvitation(data: any) {
    return this.http
              .post<{ delete: boolean,message: string }>(
                BACKEND_URL+ 'rejectinvitation',
                data
              );
  }

  storeEventId(eventId: any) {
    this.dialogBoxEventId = eventId;
  }

  getEventId() {
    return this.dialogBoxEventId;
  }

  invite(email: any, eventId: String, from: String) {
    return this.http
            .post<{ message: string}>(
              BACKEND_URL + 'invitations',
              {
                email: email,
                eventId: eventId,
                from: from
              }
            );
  }

  getEventTBA(id:string) {
    this.http.get<{
      message: string ,
      eventTBA: EventTBA ,
    }>
    (BACKEND_URL + 'tba/' + id)
    .pipe(map((eventTBAdata) => {
      return eventTBAdata.eventTBA;
    }))
    .subscribe(eventTBAdata => {
      this.eventTBA = eventTBAdata;
      this.eventTBAUpdated.next({
        eventTBA: this.eventTBA
      });
    });

  }

  getEventTBAUpdateListener() {
    return this.eventTBAUpdated.asObservable();
  }

  getEventByCity(city: string) {
    const queryParams = `?city=${city}`;
    this.http
      .get<{ message: string; events: any; maxEvents: number }>(
        BACKEND_URL + 'city/' + queryParams
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
                verify: event.verify
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

  addEvent( title: string,
            content: string,
            image: File,
            startDate: string,
            endDate: string,
            category: string,
            is_private: Boolean,
            max_users: Number,
            eventFee: Number,
            eventManagerName: string,
            eventManagerEmail: string,
            eventManagerPhone: string,
            street: string,
            city: string,
            state: string,
            country: string,
            zipcode: string) {
    const eventData = new FormData();
    const address = [{
      street: street,
      city: city,
      state: state,
      country: country,
      zipcode: zipcode
    }];
    const event_manager = [{
      name: eventManagerName,
      email: eventManagerEmail,
      phone: eventManagerPhone
    }];
    if (max_users === null) {
      max_users = -1;
    }
    if (eventFee === null) {
      eventFee = 0;
    }
    eventData.append('title', title);
    eventData.append('content', content);
    eventData.append('image', image, title);
    eventData.append('startDate', startDate);
    eventData.append('endDate', endDate);
    eventData.append('category', category);
    const privacy = (is_private === true);
    eventData.append('is_private', privacy.toString());
    eventData.append('max_users', max_users.toString());
    eventData.append('eventFee', eventFee.toString());
    eventData.append('event_manager', JSON.stringify(event_manager));
    eventData.append('address', JSON.stringify(address));
    this.http
      .post<{ message: string; event: Event }>(
        BACKEND_URL,
        eventData
      )
      .subscribe(responseData => {
        this.router.navigate(['/']);
      });
  }

  postTBA(msg: any, id:string){
    this.http
    .post<{ message:string, _id: string }>(
      BACKEND_URL + 'tba/' + id,
      msg
    ).subscribe(response => {
      console.log(response);
      this.eventTBA.announcements.push({_id: response._id,announcement: msg.tba});
      this.eventTBAUpdated.next({
        eventTBA: this.eventTBA
      })
    })
  }

  updateEventTBA(eventTBAold: any, eventId: string,eventnewTBA: string ) {
    this.http.post<{message: string}>(BACKEND_URL + 'tba?eventId=' + eventId + '&eventTBAId=' + eventTBAold._id,
    {eventTBA: eventnewTBA} )
      .subscribe(response => {
        console.log(response.message);
        this.eventTBA.announcements[this.eventTBA.announcements.indexOf(eventTBAold)].announcement = eventnewTBA;
        this.eventTBAUpdated.next({
          eventTBA: this.eventTBA
        });
      })

  }

  updateEvent(id: string,
              title: string,
              content: string,
              image: File | string,
              startDate: string,
              endDate: string,
              category: string,
              is_private: Boolean,
              max_users: Number,
              eventFee: Number,
              eventManagerName: string,
              eventManagerEmail: string,
              eventManagerPhone: string,
              street: string,
              city: string,
              state: string,
              country: string,
              zipcode: string) {
    let eventData: Event | FormData;
    if (typeof image === 'object') {
      eventData = new FormData();
      const address = [{
        street: street,
        city: city,
        state: state,
        country: country,
        zipcode: zipcode
      }];
      const event_manager = [{
        name: eventManagerName,
        email: eventManagerEmail,
        phone: eventManagerPhone
      }];
      eventData.append('id', id);
      eventData.append('title', title);
      eventData.append('content', content);
      eventData.append('image', image, title);
      eventData.append('startDate', startDate);
      eventData.append('endDate', endDate);
      eventData.append('category', category);
      const privacy = (is_private === true);
      eventData.append('is_private', privacy.toString());
      eventData.append('max_users', max_users.toString());
      eventData.append('eventFee', eventFee.toString());
      eventData.append('event_manager', JSON.stringify(event_manager));
      eventData.append('address', JSON.stringify(address));
    } else {
      const privacy = (is_private === true);
      eventData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        startDate: startDate,
        endDate: endDate,
        category: category,
        is_private: privacy,
        max_users: max_users,
        eventFee: eventFee,
        event_manager: {
          name: eventManagerName,
          email: eventManagerEmail,
          phone: eventManagerPhone
        },
        address: {
          street: street,
          city: city,
          state: state,
          country: country,
          zipcode: zipcode
        },
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

  deleteEventTBA(eventTBA: any, eventId: string) {
    return this.http.delete<{message: string}>(BACKEND_URL + 'tba?eventId=' + eventId + '&eventTBAId=' + eventTBA._id )
      .subscribe(response => {
        console.log(response.message);
        this.eventTBA.announcements.splice(this.eventTBA.announcements.indexOf(eventTBA),1);
        this.eventTBAUpdated.next({
          eventTBA: this.eventTBA
        });
      })

  }
}
