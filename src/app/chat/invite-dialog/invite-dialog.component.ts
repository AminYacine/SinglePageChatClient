import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-invite-dialog',
  templateUrl: './invite-dialog.component.html',
  styleUrls: ['./invite-dialog.component.css']
})
export class InviteDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { roomName: string},
              public dialogRef: MatDialogRef<InviteDialogComponent>,) { }

  ngOnInit(): void {
  }

 closeDialog() {
    this.dialogRef.close({join: false});
 }

 join(){
    this.dialogRef.close({join: true})
 }

}
