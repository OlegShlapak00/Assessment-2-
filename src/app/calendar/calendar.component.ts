import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {MatCalendarCellClassFunction} from '@angular/material/datepicker';
import * as moment from 'moment';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent {
  @Input() examDates?: Date[];
  @Output() onDateChanged = new EventEmitter<string>;
  selected: Date | null = null;

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    // Only highlight dates inside the month view.
    if (view === 'month') {
      const dateString = moment(cellDate).format('YYYY-MM-DD');

      return this.examDates.findIndex(date => moment(date).format('YYYY-MM-DD') === dateString) !== -1 ? 'highlight' : '';
    }

    return '';
  };

  onSelect(date: Date): void {
    this.onDateChanged.emit(moment(date).format('YYYY-MM-DD'));
  }
}
