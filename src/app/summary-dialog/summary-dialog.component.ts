import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-summary-dialog',
  templateUrl: './summary-dialog.component.html',
  styleUrl: './summary-dialog.component.scss'
})
export class SummaryDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data) {}
}
