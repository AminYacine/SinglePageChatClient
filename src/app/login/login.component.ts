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
import {UserRegisteredDTO} from "../models/register/UserRegisteredDTO";
import {RegisterUserDTO} from "../models/register/RegisterUserDTO";
import {UserRegisterFailedDTO} from "../models/register/UserRegisterFailedDTO";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  inLogin: boolean = true;
  socketStatusSubscription!: Subscription;

  loginData!: FormGroup;
  email!: FormControl;
  password!: FormControl;

  registerData!: FormGroup;
  emailRegister!: FormControl;
  userNameRegister!: FormControl;
  passwordRegister!: FormControl;
  passwordConfirm!: FormControl;
  constructor(private evtHandlerService: EventHandlerService, private router: Router, private authService: AuthenticationService) {
    this.initForms();
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


  private initForms() {
    this.email = new FormControl("", Validators.required);
    this.password = new FormControl("", Validators.required);
    this.loginData = new FormGroup({
      email: this.email,
      password: this.password
    });

    this.emailRegister = new FormControl("", Validators.required);
    this.passwordRegister = new FormControl("", Validators.required);
    this.userNameRegister = new FormControl("", Validators.required);
    this.passwordConfirm = new FormControl("", Validators.required);
    this.registerData = new FormGroup({
      email: this.emailRegister,
      password: this.passwordRegister,
      passwordConfirm: this.passwordConfirm,
      username: this.userNameRegister,
    });
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
      case EventTypes.UserRegistered: {
        this.handleUserRegistered(eventDTO.value);
        break;
      }
      case EventTypes.RegisterFailed: {
        this.handleUserRegistereFailed(eventDTO.value);
        break;
      }
      default:
        console.log("Server: ", eventDTO.type);
    }
  }

  private handleLoggedInEvent(event: EventDTO): void {

    console.log("Logged in: ", event.value);
    const sessionData: LoggedInDTO = event.value;
    const session = new Session(sessionData.id, sessionData.token, sessionData.email, sessionData.name);
    this.authService.loggedIn(session);
    this.router.navigateByUrl("/chat");
  }

  private handleLoggInFailed(event: EventDTO): void {
    //todo display error message
    console.log("Login Failed");
  }

  private handleLoggedOutEvent(event: EventDTO) {
    //todo display successfully logged out
    const message: LoggedOutDTO = event.value;
    console.log("LoggedOut successfully ", message.email);
  }


  private handleUserRegistered(userRegisteredEvent: UserRegisteredDTO) {
    console.log("Registered", userRegisteredEvent.email);
    this.registerData.reset();
    this.switchToLoginView();
    //todo display successfully registered please login
  }

  private handleUserRegistereFailed(registerFailed: UserRegisterFailedDTO) {
    console.log("Register Failed with email", registerFailed.email)
    //todo email already in use
  }

  /**
   * Method that sends a Login event to the Websocket with the values of the input fields
   */
  login() {
    if (this.loginData.valid) {
      this.evtHandlerService.message.next(new EventDTO(EventTypes.Login, new LoginDTO(this.email.value, this.password.value)))
    }
  }

  register() {
    if (this.registerData.valid) {
      this.evtHandlerService.message.next(
        new EventDTO(EventTypes.RegisterUser, new RegisterUserDTO(this.emailRegister.value, this.userNameRegister.value, this.passwordRegister.value ) ))
    }
  }

  switchToRegisterView() {
    this.inLogin = false;
  }

  switchToLoginView(){
    this.inLogin = true;
  }


}
