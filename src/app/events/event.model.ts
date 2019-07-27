export interface Event {
  id: string;
  title: string;
  content: string;
  imagePath: string;
  startDate: string;
  endDate: string;
  category: string;
  is_private: Boolean;
  max_users: Number;
  eventFee: Number;
  event_manager: {
    name: string,
    email: string,
    phone: string
  };
  address: {street: string,
    city: string,
    state: string,
    country: string,
    zipcode: string};
  creator: string;
   verify: Boolean;
}
