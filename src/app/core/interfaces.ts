import Roles from 'app/core/models/Roles.enum';


export interface HasId {
  id: number;
}


export interface UserProfile {
  first_name: string;
  last_name: string;
  address: string;
  email?: string;
  role: Roles;
}
