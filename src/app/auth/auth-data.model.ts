export interface AuthData {
  email: string;
  password: string;
}
export interface authDataP {
  email: string;
  password: string;
  name: string;
  isactive: boolean;
}
export interface authDataNP {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNum: null;
  invitations: [{accepted: boolean, from: string, eventId: string}];
  interests: string[];
  isactive: boolean;
   eventsJoined: any;
}
