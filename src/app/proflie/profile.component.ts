import { Component, OnInit } from '@angular/core';
import {Session} from "../models/Session";

@Component({
  selector: 'ProfileComponent',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username:string = Session.username;
  email:string = Session.email;

  constructor() { }

  ngOnInit(): void {
  }

}
