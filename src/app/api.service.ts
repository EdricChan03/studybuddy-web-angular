import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import type { User } from '@firebase/auth-types';
import { Observable } from 'rxjs';

// This file contains the client-side code for the StudyBuddy API

@Injectable()
export class ApiService {
  constructor(private http: HttpClient) { }
  /** The base URL for all API endpoints */
  readonly apiBaseUrl = 'https://studybuddy-api.herokuapp.com';

  /**
   * Retrieves a Firebase user by email
   * @param email An email address
   * @returns The result of the GET request
   */
  getUserByEmail(email: string): Observable<User> {
    return this.http.get<User>(
      `${this.apiBaseUrl}/v1/user`,
      {
        params: { email }
      }
    );
  }

  /**
   * Retrieves a Firebase user by phone number
   * @param phoneNumber A phone number as a string
   * @returns The result of the GET request
   */
  getUserByPhoneNumber(phoneNumber: string): Observable<User> {
    return this.http.get<User>(
      `${this.apiBaseUrl}/v1/user`,
      {
        params: { phoneNumber }
      }
    );
  }

  /**
   * Retrieves a Firebase user by ID
   * @param id A valid user ID
   * @returns The result of the GET request
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(
      `${this.apiBaseUrl}/v1/user`,
      {
        params: { id }
      }
    );
  }

  /**
   * Retrieves the current uptime of the API server
   * @returns The result of the GET request
   */
  getUptime(): Observable<number> {
    return this.http.get<number>(
      `${this.apiBaseUrl}/v1/uptime`
    );
  }
}
