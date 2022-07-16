import {Injectable} from '@angular/core';
import {Session} from "../../models/Session";
import {Observable, of} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private TOKEN_ID: string = "token";
  private EMAIL_ID: string = "email";
  private USERNAME_ID: string = "username";
  private USERID_ID: string = "id";

  constructor(private router: Router) {
  }

  loggedIn(session: Session) {
    this.setLocalstorageSession(session);
  }

  loggedOut() {
    this.clearLocalStorage();
    this.router.navigateByUrl("/login");
  }

  isUserLoggedIn(): boolean {
    return localStorage.getItem(this.TOKEN_ID) != null;
  }

  private setLocalstorageSession(session: Session) {
    localStorage.setItem(this.TOKEN_ID, session.token);
    localStorage.setItem(this.EMAIL_ID, session.email);
    localStorage.setItem(this.USERNAME_ID, session.username);
    localStorage.setItem(this.USERID_ID, String(session.id));
  }

  private clearLocalStorage() {
    localStorage.removeItem(this.TOKEN_ID);
    localStorage.removeItem(this.EMAIL_ID);
    localStorage.removeItem(this.USERNAME_ID);
    localStorage.removeItem(this.USERID_ID);
  }
  getEmail() {
    return localStorage.getItem(this.EMAIL_ID);
  }
  getUserName() {
    return localStorage.getItem(this.USERNAME_ID);
  }

  getToken() {
    return localStorage.getItem(this.TOKEN_ID);
  }

  changeUserName(newUserName: string) {
    localStorage.setItem(this.USERNAME_ID, newUserName);
  }

}
