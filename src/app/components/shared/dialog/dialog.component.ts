import { Component, OnInit, Inject } from '@angular/core';
import {DialogResultType} from '../../../models/enum.model';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {DialogConfig} from '../../../models/core.model';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  public DialogResultType = DialogResultType;

  constructor(
    @Inject(MAT_DIALOG_DATA) public config: DialogConfig,
    public dialogRef: MatDialogRef<DialogComponent>) {
  }

  ngOnInit() {
  }

}
