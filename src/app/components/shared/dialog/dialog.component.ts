import {Component, OnInit, Inject, Injector, ChangeDetectorRef} from '@angular/core';
import {DialogResultType} from '../../../core/enums.core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {DialogConfig} from '../../../core/types.core';

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
