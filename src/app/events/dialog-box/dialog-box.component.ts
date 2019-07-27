
import {Component, Inject} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DialogData} from '../dialog.model';

@Component({
    selector: 'dialog-overview',
    templateUrl: 'dialog-box.component.html',
  })
  export class DialogBoxComponent {
  
    constructor(
      public dialogRef: MatDialogRef<DialogBoxComponent>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
  }