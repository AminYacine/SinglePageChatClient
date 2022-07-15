import {Injectable} from '@angular/core';
import {Session} from "../models/Session";
import {Observable, of} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor() {
  }

  loggedIn(session: Session) {
    this.setLocalstorageSession(session);
  }

  loggedOut() {
    this.clearLocalStorage();
  }

  isUserLoggedIn(): boolean {
    return localStorage.getItem("token") != null;
  }

  private setLocalstorageSession(session: Session) {
    localStorage.setItem("token", session.token);
    localStorage.setItem("email", session.email);
    localStorage.setItem("username", session.username);
    localStorage.setItem("id", String(session.id));
  }

  private clearLocalStorage() {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("id");
  }
}
