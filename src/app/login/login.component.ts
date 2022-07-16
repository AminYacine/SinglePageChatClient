import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {EventHandlerService} from "../services/eventHandlerService/event-handler.service";
import {EventDTO} from "../models/EventDTO";
import {EventTypes} from "../models/EventTypes";
import {LoggedInDTO} from "../models/login/LoggedInDTO";
import {Session} from "../models/Session";
import {LoginDTO} from "../models/login/LoginDTO";
import {Router} from "@angular/router";
import {AuthenticationService} from "../services/authService/authentication.service";
import {LoggedOutDTO} from "../models/login/LoogedOutDTO";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginData: FormGroup;
  email: FormControl;
  password: FormControl;
  isLoggedIn: boolean = false;
  showInvalidInput: boolean = false;
  socketStatusSubscription!: Subscription;

  constructor(private evtHandlerService: EventHandlerService, private router: Router, private authService: AuthenticationService) {

    this.email = new FormControl("", Validators.required);
    this.password = new FormControl("", Validators.required);
    this.loginData = new FormGroup({
      email: this.email,
      password: this.password
    });
  }

  ngOnInit(): void {

    if (this.authService.isUserLoggedIn()) {
      this.router.navigateByUrl("/chat");
    }

    //if something is pushed to the message subject this observer will be notified and checks the type
    this.evtHandlerService.message.subscribe({
      next: eventDTO => {
        this.handleEvent(eventDTO);
      },
      error: err => {
        console.log("error", err)
      },
    });

    this.socketStatusSubscription = this.evtHandlerService.socketStatus.subscribe({
        next: value => {
          const ev: Event = value;
          //todo message in ui
          console.log("Connection to server successful", ev.type);
        },
        complete: () => {
          //todo server offline, try again later by reloading the page
          console.log("Connection closed");
        }
      });
  }

  ngOnDestroy(): void {
    this.evtHandlerService.message.unsubscribe();
    this.socketStatusSubscription.unsubscribe();
    console.log("unsubscribed");
  }


  private handleEvent(eventDTO: EventDTO) {
    switch (eventDTO.type) {
      case EventTypes.LoggedIn: {
        this.handleLoggedInEvent(eventDTO);
        break;
      }
      case EventTypes.LogginFailed: {
        this.handleLoggInFailed(eventDTO);
        break;
      }
      case EventTypes.LoggedOut: {
        this.handleLoggedOutEvent(eventDTO);
        break;
      }
      default:
        console.log("Server: ", eventDTO.type);
    }
  }

  handleLoggedInEvent(event: EventDTO): void {

    console.log("Logged in: ", event.value);
    const sessionData: LoggedInDTO = event.value;
    const session = new Session(sessionData.id, sessionData.token, sessionData.email, sessionData.name);
    this.authService.loggedIn(session);
    this.router.navigateByUrl("/chat");
  }

  handleLoggInFailed(event: EventDTO): void {
    //todo display error message
    console.log("Login Failed");
  }

  handleLoggedOutEvent(event: EventDTO) {
    //todo display successfully logged out
    const message: LoggedOutDTO = event.value;
    console.log("LoggedOut successfully ", message.email);
  }

  /**
   * Method that sends a Login event to the Websocket with the values of the input fields
   */
  login() {
    if (this.loginData.valid) {
      this.evtHandlerService.message.next(new EventDTO(EventTypes.Login, new LoginDTO(this.email.value, this.password.value)))
    } else {
      this.showInvalidInput = true;
    }
  }
}
