import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {EventDTO} from "../models/EventDTO";
import {EventTypes} from "../models/EventTypes";
import {RenameUserDTO} from "../models/user/RenameUserDTO";
import {AuthenticationService} from "../services/authService/authentication.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {ChangePasswordDTO} from "../models/user/ChangePasswordDTO";

@Component({
  selector: 'ProfileComponent',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnDestroy {


  @Input() username: string = "";
  @Output() renameUserEvent = new EventEmitter<string>();
  @Output() changePasswordEvent = new EventEmitter<EventDTO>();
  email: string;

  usernameFormGroup!: FormGroup;
  usernameInput!: FormControl;

  changePasswordFormGroup!: FormGroup;
  oldPassword!: FormControl;
  newPassword!: FormControl;
  confirmPassword!: FormControl;


  constructor(private authService: AuthenticationService) {
    this.email = this.authService.getEmail()!;

    this.initForms();

  }

  ngOnInit(): void {
    console.log("profile init");
  }

  async ngOnDestroy(): Promise<void> {
    console.log("profile unsubscribed");
  }

  initForms(){
    this.usernameInput = new FormControl("", Validators.required);
    this.usernameFormGroup = new FormGroup({
      usernameInput: this.usernameInput
    });

    this.oldPassword = new FormControl("", Validators.required);
    this.newPassword = new FormControl("", Validators.required);
    this.confirmPassword = new FormControl("", Validators.required);
    this.changePasswordFormGroup = new FormGroup({
      newPassword: this.newPassword,
      oldPassword: this.oldPassword,
      confirmPassword: this.confirmPassword,
    });
  }

  renameUser() {
    console.log("clicked rename");
    if (this.usernameFormGroup.valid) {
      this.renameUserEvent.emit(this.usernameInput.value);
      this.usernameInput.reset();
    }
  }

  changePassword() {
    console.log("clicked changePW");
    if (this.usernameFormGroup.valid) {
      this.changePasswordEvent.emit(new EventDTO(
        EventTypes.ChangeUserPassword, new ChangePasswordDTO(this.authService.getEmail()!, this.oldPassword.value, this.newPassword.value)
      ));
      this.oldPassword.reset();
      this.newPassword.reset();
      this.confirmPassword.reset();
    }else{
      console.log()
    }
  }

}
