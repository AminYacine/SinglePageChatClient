import {Component} from '@angular/core';
import {WebSocketService} from "./services/web-socket.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EventHandlerService} from "./services/event-handler.service";
import {LogInHandler} from "./services/LogInHandler";
import {EventDTO} from "./models/EventDTO";
import {Session} from "./models/Session";
import {LoggedInDTO} from "./models/login/LoggedInDTO";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements LogInHandler{
  webSocketService: WebSocketService;
  loginData: FormGroup;
  email: FormControl;
  password: FormControl;
  isLoggedIn: boolean = false;
  showInvalidInput:boolean = false;

  constructor() {
    const eventHandlerService =  EventHandlerService.getInstance();
    eventHandlerService.addLogInHandler(this);
    this.webSocketService = new WebSocketService();

    this.email = new FormControl("", Validators.required);
    this.password = new FormControl("", Validators.required);
    this.loginData = new FormGroup({
      email: this.email,
      password: this.password
    });
  }

  login() {
    if (this.loginData.valid) {
      this.webSocketService.logIn(this.email.value, this.password.value);
    }
    else{
      this.showInvalidInput = true;
    }

  }

  handleLoggedInEvent(event: EventDTO): void {
    console.log("Logged in: ", event.value);

    const sessionData: LoggedInDTO = event.value;
    Session.id = sessionData.id;
    Session.token = sessionData.token;
    Session.username = sessionData.name;
    Session.email = sessionData.email;

    this.isLoggedIn = true;
  }

  handleLoggInFailed(event: EventDTO): void {
    //todo display error message
    console.log("Login Failed");
  }



}
