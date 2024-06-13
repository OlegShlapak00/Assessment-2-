import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../providers/auth.service";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {SummaryDialogComponent} from "../summary-dialog/summary-dialog.component";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {IExam} from "../models/exam";
import {of, throwError} from "rxjs";

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;
  let mockMatDialog: jasmine.SpyObj<MatDialog>;
  let mockRouter: jasmine.SpyObj<Router>;

  const exam = {
    "details": {
      "summary": "Calculating the speed of an Uber delivery robot with 54W battery power left when moving uphill on a 30 degree incline",
        "student": {
        "id": 7,
          "firstName": "Karl",
          "lastName": "Frosh",
          "email": "kfrosh@ocu,edu",
          "verified": true
      },
      "school": {
        "id": 2,
          "schoolName": "Riverside University"
      },
      "grade_value": 91,
        "exam_date": "2021-01-28",
        "course_number": "MECH-8741",
        "semester": "Spring",
        "discipline": "Industrial Engineering",
        "subject": "Mechatronics",
        "level": "Advanced Graduate",
        "ungraded_url": "https://www.example.com/ungraded-5",
        "graded_url": "https://www.example.com/graded-5",
        "status": 1
    },
    "id": 5
  };

  const user = {
    "id": 7,
    "username": "karltheman",
    "role": "student",
    "status": 1,
    "passwordHash": "202cb962ac59075b964b07152d234b70"
  }

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['updateUser', 'updateExam']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['success', 'error']);
    mockMatDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [DashboardComponent, SummaryDialogComponent],
      imports: [
        ReactiveFormsModule,
        MatTableModule,
        MatPaginatorModule,
        MatDialogModule,
        BrowserAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: { snapshot: { data: { exams: [exam], user } } } },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ToastrService, useValue: mockToastrService },
        { provide: MatDialog, useValue: mockMatDialog },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog with summary text', () => {
    const summaryText = 'Test Summary';
    component.openDialog(summaryText);
    expect(mockMatDialog.open).toHaveBeenCalledWith(SummaryDialogComponent, {
      data: { summaryText }
    });
  });

  it('should change status and update user and exam', () => {
    const exam = {
      details: {
        student: { id: 1 },
        status: 0
      }
    } as IExam;
    const event = { value: '1' };
    const updatedUser = { id: 1, status: 1 };
    const updatedExam = { ...exam, details: { ...exam.details, status: 1 } };

    mockAuthService.updateUser.and.returnValue(of(updatedUser));
    mockAuthService.updateExam.and.returnValue(of(updatedExam));

    component.users = [{ id: 1 }];
    component.changeStatus(event, exam);

    expect(mockAuthService.updateUser).toHaveBeenCalledWith({ ...updatedUser, status: 1 } as any);
    expect(mockToastrService.success).toHaveBeenCalledWith('Successfully Updated User');
    expect(mockAuthService.updateExam).toHaveBeenCalledWith(updatedExam as any);
    expect(mockToastrService.success).toHaveBeenCalledWith('Successfully Updated Exam');
  });

  it('should handle error when updating user fails', () => {
    const exam = {
      details: {
        student: { id: 1 },
        status: 0
      }
    } as IExam;
    const event = { value: '1' };
    mockAuthService.updateUser.and.returnValue(throwError('Error'));
    mockAuthService.updateExam.and.returnValue(throwError('Error'));

    component.users = [{ id: 1 }];
    component.changeStatus(event, exam);

    expect(mockAuthService.updateUser).toHaveBeenCalled();
    expect(mockToastrService.error).toHaveBeenCalledWith('Update failed');
  });

  it('should handle error when updating exam fails', () => {
    const exam = {
      details: {
        student: { id: 1 },
        status: 0
      }
    } as IExam;
    const event = { value: '1' };
    const updatedUser = { id: 1, status: 1 };
    const updatedExam = { ...exam, details: { ...exam.details, status: 1 } };

    mockAuthService.updateUser.and.returnValue(of(updatedUser));
    mockAuthService.updateExam.and.returnValue(throwError('Error'));

    component.users = [{ id: 1 }];
    component.changeStatus(event, exam);

    expect(mockAuthService.updateUser).toHaveBeenCalledWith({ ...updatedUser, status: 1 } as any);
    expect(mockToastrService.success).toHaveBeenCalledWith('Successfully Updated User');
    expect(mockAuthService.updateExam).toHaveBeenCalledWith(updatedExam as any);
    expect(mockToastrService.error).toHaveBeenCalledWith('Update failed');
  });
});
