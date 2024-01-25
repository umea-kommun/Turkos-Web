import * as Enums from '@/models/Enums';
/**
 * State för vuex-store
 */
export interface IRootState {
  user: IUser;
}

/**
 * Interface for IUserContactInfo
 */
export interface IUserContactInfo {
  socialSecurityNumber: string;
  firstName: string;
  lastName: string;
  address: string;
  postalNumber: string;
  city: string;
  phoneNumber: string;
  email: string;
	ageToday?: number;
	ageThisYear?: number;
	newAgeInXDays?: number;
}

/**
 * User En inloggad användare
 */
export interface IUser {
  socialSecurityNumber: string;
  fullName?: string;
  firstName: string;
  lastName: string;
  token?: string;
  email: string | null;
  scope?: string[];
  userContactInfo?: IUserContactInfo | null;
  isAuthenticated: boolean;
  protectedIdentity?: string;
  userId: string;

  /**
   * Unix timestamp telling when user session expires
   */
  exp?: number;

  /**
   * The auth client used to login this user
   */
  authClientName: string;

  /**
   * Which idp do we have behind the user token
   */
  idp?: string;
}
