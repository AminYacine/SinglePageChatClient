import {Component, OnDestroy, OnInit} from '@angular/core';
import {EventDTO} from "../models/EventDTO";
import {EventTypes} from "../models/EventTypes";
import {RenameUserDTO} from "../models/user/RenameUserDTO";
import {EventHandlerService} from "../services/eventHandlerService/event-handler.service";
import {AuthenticationService} from "../services/authService/authentication.service";
import {UserRenamedDTO} from "../models/user/UserRenamedDTO";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'ProfileComponent',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  username: string;
  email: string;

  usernameFormGroup: FormGroup;
  usernameInput: FormControl;

  constructor(
    private evtHandlerService: EventHandlerService,
    private authService: AuthenticationService
  ) {
    this.username = this.authService.getUserName()!;
    this.email = this.authService.getEmail()!;

    this.usernameInput = new FormControl("", Validators.required);
    this.usernameFormGroup = new FormGroup({
      usernameInput: this.usernameInput
    })
  }

  ngOnInit(): void {
    console.log("profile init");
    this.evtHandlerService.message.subscribe({
      next: eventDTO => {
        this.handleEvent(eventDTO);
      },
      error: err => {
        //todo display error message
        console.log(err);
      },
    });
  }

  async ngOnDestroy(): Promise<void> {
    console.log("profile unsubscribed");
    this.evtHandlerService.message.unsubscribe();
  }


  private handleEvent(eventDTO: EventDTO) {
    switch (eventDTO.type) {
      case EventTypes.UserRenamed: {
        this.handleRenamedUser(eventDTO.value);
        break;
      }
      default: {
        console.log("Server: ", eventDTO);
      }
    }
  }
  private handleRenamedUser(renamedEvent: UserRenamedDTO) {
    if (renamedEvent.email === this.authService.getEmail()) {
      console.log("in profile renameduser");
      this.authService.changeUserName(renamedEvent.name);
      this.username = renamedEvent.name;
      //todo display successfully renamed
    }
  }
  renameUser() {
    console.log("clicked rename");
    if (this.usernameFormGroup.valid) {
      this.evtHandlerService.message.next(
        new EventDTO(
          EventTypes.RenameUser, new RenameUserDTO(this.authService.getEmail()!, this.usernameInput.value)
        ));
      this.usernameInput.reset();
    }

  }


}
