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
import {MatSnackBar} from "@angular/material/snack-bar";
import {LoginFailedDTO} from "../models/login/LoginFailedDTO";

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

  constructor(private evtHandlerService: EventHandlerService, private router: Router, private authService: AuthenticationService, private snackbar: MatSnackBar) {
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
        const ev: EventDTO = err;
        this.snackbar.open("Error " + ev.value, "Ok", {duration: 3000});
      },
    });

    this.socketStatusSubscription = this.evtHandlerService.socketStatus.subscribe({
      next: value => {
        const ev: Event = value;
        this.snackbar.open("Successfully connected to server", "Ok", {duration: 3000});
      },
      complete: () => {
        const sb = this.snackbar.open("Connection to Server lost", "Reload", {duration: 10000});
        sb.onAction().subscribe(value => {
          window.location.reload();
        })
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
        this.handleLoggInFailed(eventDTO.value);
        break;
      }
      case EventTypes.LoggedOut: {
        this.handleLoggedOutEvent(eventDTO.value);
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
    const sessionData: LoggedInDTO = event.value;
    const session = new Session(sessionData.id, sessionData.token, sessionData.email, sessionData.name);
    this.authService.loggedIn(session);
    this.router.navigateByUrl("/chat");
    const sb = this.snackbar.open("Logged in", "Ok", {duration: 2000});
  }

  private handleLoggInFailed(event: LoginFailedDTO): void {
    this.snackbar.open("User and password don't match", "Ok");
  }

  private handleLoggedOutEvent(message: LoggedOutDTO) {
    this.snackbar.open("Successfully logged out!", "Ok", {duration: 3000});
  }


  private handleUserRegistered(userRegisteredEvent: UserRegisteredDTO) {
    this.registerData.reset();
    this.switchToLoginView();
    this.snackbar.open("Successfully Registered!", "Ok", {duration: 3000});
  }

  private handleUserRegistereFailed(registerFailed: UserRegisterFailedDTO) {
    console.log("Register Failed with email", registerFailed.email)
    this.snackbar.open("Email "+registerFailed.email+" already in use", "Ok", {duration: 4000});
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
        new EventDTO(EventTypes.RegisterUser, new RegisterUserDTO(this.emailRegister.value, this.userNameRegister.value, this.passwordRegister.value)))
    }
  }

  switchToRegisterView() {
    this.inLogin = false;
  }

  switchToLoginView() {
    this.inLogin = true;
  }


}
