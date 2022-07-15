import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'ProfileComponent',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  username = localStorage.getItem("username");
  email = localStorage.getItem("email");

  constructor() {
  }

  ngOnInit(): void {
  }

}
