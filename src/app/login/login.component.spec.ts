import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import {ActivatedRoute} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../providers/auth.service";
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {Md5} from "ts-md5";

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockToastrService: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login']);
    mockToastrService = jasmine.createSpyObj('ToastrService', ['error', 'success']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: ActivatedRoute, useValue: { snapshot: { data: { users: [{ username: 'jackb', passwordHash: Md5.hashStr('password'), status: 1 }] } } } },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ToastrService, useValue: mockToastrService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    expect(component.loginForm).toBeTruthy();
    expect(component.loginForm.controls.email.value).toEqual('jackb');
    expect(component.loginForm.controls.password.value).toEqual('password');
  });

  it('should show error if the form is invalid on submit', () => {
    component.loginForm.controls.email.setValue('');
    component.onSubmitForm();
    expect(mockToastrService.error).not.toHaveBeenCalled();
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('should show error if user is not found', () => {
    component.loginForm.controls.email.setValue('wronguser');
    component.onSubmitForm();
    expect(mockToastrService.error).toHaveBeenCalledWith('No user found!');
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('should show error if user is not active', () => {
    component.users[0].status = 0;
    component.onSubmitForm();
    expect(mockToastrService.error).toHaveBeenCalledWith('Please contact Admin to login!');
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('should show error if password does not match', () => {
    component.loginForm.controls.password.setValue('wrongpassword');
    component.onSubmitForm();
    expect(mockToastrService.error).toHaveBeenCalledWith("Password doesn't match");
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('should call login if credentials are correct', () => {
    component.onSubmitForm();
    expect(mockAuthService.login).toHaveBeenCalledWith(component.users[0]);
  });
});
