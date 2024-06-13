import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CalendarComponent} from './calendar.component';
import * as moment from 'moment';


describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should highlight exam dates', () => {
    component.examDates = [new Date(2023, 5, 13), new Date(2023, 5, 15)];
    fixture.detectChanges();

    const cellDate1 = new Date(2023, 5, 13);
    const cellDate2 = new Date(2023, 5, 15);
    const cellDate3 = new Date(2023, 5, 20);

    expect(component.dateClass(cellDate1, 'month')).toBe('highlight');
    expect(component.dateClass(cellDate2, 'month')).toBe('highlight');
    expect(component.dateClass(cellDate3, 'month')).toBe('');
  });

  it('should emit date change on selection', () => {
    spyOn(component.onDateChanged, 'emit');
    const selectedDate = new Date(2023, 5, 13);
    component.onSelect(selectedDate);

    expect(component.onDateChanged.emit).toHaveBeenCalledWith(moment(selectedDate).format('YYYY-MM-DD'));
  });

  it('should not highlight dates in year or multi-year views', () => {
    component.examDates = [new Date(2023, 5, 13)];
    fixture.detectChanges();

    const cellDate = new Date(2023, 5, 13);

    expect(component.dateClass(cellDate, 'year')).toBe('');
    expect(component.dateClass(cellDate, 'multi-year')).toBe('');
  });
});
