import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserComponent } from './user.component';
import {ActivatedRoute, RouterModule} from "@angular/router";
import {ToastrModule} from "ngx-toastr";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {AuthService} from "../providers/auth.service";

describe('UserComponent', () => {
  let component: UserComponent;
  let fixture: ComponentFixture<UserComponent>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['getLoggedInUser']);
    authService.getLoggedInUser.and.returnValue({});

    await TestBed.configureTestingModule({
      declarations: [ UserComponent ],
      imports: [RouterModule.forRoot([]), ToastrModule.forRoot(), HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {snapshot: {data: {'exams': [{
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
                }]}}}
        },
        {
          provide: AuthService,
          useValue: authService
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});
