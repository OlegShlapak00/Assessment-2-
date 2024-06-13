import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Md5 } from 'ts-md5/dist/md5';
import { IExam } from '../models/exam';
import { AuthService } from '../providers/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  exams: IExam[];
  filteredExams: IExam[];
  examDates: Date[];
  passwordChangeForm: FormGroup;
  user: IExam;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.exams = this.route.snapshot.data.exams;
    this.examDates = this.exams.map(exam => new Date(exam.details.exam_date));

    if (this.exams && this.exams.length) {
      this.user = this.exams[0];
    }

    let user = this.auth.getLoggedInUser();

    this.passwordChangeForm = this.fb.group(
      {
        id: [user.id, Validators.required],
        username: [user.username, Validators.required],
        role: [user.role, Validators.required],
        password: [null, Validators.required],
        retype_password: [null, Validators.required],
      },
      {
        validator: this.confirmPassword,
      }
    );
  }

  onSubmitForm() {
    if (!this.passwordChangeForm.valid) {
      return alert('form is not valid');
    }

    let {password, id, role, username} = this.passwordChangeForm.value;

    this.auth
      .updateUser({
        id,
        role,
        username,
        passwordHash: Md5.hashStr(password),
        status: 1,
      })
      .subscribe(() => {
        this.toastr.success('your password is changed. please login again');
        this.auth.logOut();
      });
  }

  confirmPassword(c: AbstractControl): { invalid: boolean; mismatch: boolean } {
    if (c.get('password') && c.get('retype_password')) {
      return c.get('password').value !== c.get('retype_password').value
        ? { invalid: true, mismatch: true }
        : null;
    } else {
      return { invalid: true, mismatch: true };
    }
  }

  isStudent(): boolean {
    return this.auth.getLoggedInUser()?.role === 'student';
  }

  filterExams(date: string): void {
    this.filteredExams = this.exams.filter(exam => exam.details.exam_date === date);
  }
}
