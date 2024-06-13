import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#populate', () => {
    it('should set isAuthenticatedSubject to true if user is found in localStorage', () => {
      localStorage.setItem('user', JSON.stringify({ username: 'test' }));
      spyOn(service.isAuthenticatedSubject, 'next');

      service.populate();

      expect(service.isAuthenticatedSubject.next).toHaveBeenCalledWith(true);
    });

    it('should set isAuthenticatedSubject to false if user is not found in localStorage', () => {
      localStorage.removeItem('user');
      spyOn(service.isAuthenticatedSubject, 'next');

      service.populate();

      expect(service.isAuthenticatedSubject.next).toHaveBeenCalledWith(false);
    });
  });

  describe('#getUsers', () => {
    it('should return an Observable of users', () => {
      const mockUsers = [{ username: 'user1' }, { username: 'user2' }];

      service.getUsers().subscribe(users => {
        expect(users).toEqual(mockUsers);
      });

      const req = httpMock.expectOne(`${environment.api_url}/login`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });
  });

  describe('#login', () => {
    it('should set user in localStorage and navigate to dashboard for admin', () => {
      const mockUser = { username: 'admin', role: 'admin', passwordHash: 'hash' };
      spyOn(service.isAuthenticatedSubject, 'next');

      service.login(mockUser);

      expect(localStorage.getItem('user')).toEqual(JSON.stringify(mockUser));
      expect(service.isAuthenticatedSubject.next).toHaveBeenCalledWith(true);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/dashboard');
    });

    it('should set user in localStorage and navigate to user for non-admin', () => {
      const mockUser = { username: 'user', role: 'user', passwordHash: 'hash' };
      spyOn(service.isAuthenticatedSubject, 'next');

      service.login(mockUser);

      expect(localStorage.getItem('user')).toEqual(JSON.stringify(mockUser));
      expect(service.isAuthenticatedSubject.next).toHaveBeenCalledWith(true);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/user');
    });
  });

  describe('#logOut', () => {
    it('should remove user from localStorage and navigate to login', () => {
      localStorage.setItem('user', JSON.stringify({ username: 'test' }));
      spyOn(service.isAuthenticatedSubject, 'next');

      service.logOut();

      expect(localStorage.getItem('user')).toBeNull();
      expect(service.isAuthenticatedSubject.next).toHaveBeenCalledWith(false);
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/login');
    });
  });

  describe('#updateUser', () => {
    it('should send a PUT request to update the user', () => {
      const mockUser = { id: 1, username: 'user' };

      service.updateUser(mockUser).subscribe(response => {
        expect(response).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${environment.api_url}/login/update/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockUser);
    });
  });

  describe('#updateExam', () => {
    it('should send a PUT request to update the exam', () => {
      const mockExam = { id: 1, details: 'details' };

      service.updateExam(mockExam).subscribe(response => {
        expect(response).toEqual(mockExam);
      });

      const req = httpMock.expectOne(`${environment.api_url}/exams/update/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockExam);
    });
  });

  describe('#getLoggedInUser', () => {
    it('should return the logged in user from localStorage', () => {
      const mockUser = { username: 'test' };
      localStorage.setItem('user', JSON.stringify(mockUser));

      const user = service.getLoggedInUser();

      expect(user).toEqual(mockUser);
    });

    it('should return null if no user is found in localStorage', () => {
      localStorage.removeItem('user');

      const user = service.getLoggedInUser();

      expect(user).toBeNull();
    });
  });

  describe('#isAuthenticated', () => {
    it('should return true if user is found in localStorage', () => {
      localStorage.setItem('user', JSON.stringify({ username: 'test' }));

      const isAuthenticated = service.isAuthenticated();

      expect(isAuthenticated).toBeTrue();
    });

    it('should return false if no user is found in localStorage', () => {
      localStorage.removeItem('user');

      const isAuthenticated = service.isAuthenticated();

      expect(isAuthenticated).toBeFalse();
    });
  });

  describe('#getExams', () => {
    it('should return an Observable of exams', () => {
      const mockExams = [{ id: 1, details: 'details1' }, { id: 2, details: 'details2' }];

      service.getExams().subscribe(exams => {
        expect(exams).toEqual(mockExams);
      });

      const req = httpMock.expectOne(`${environment.api_url}/exams`);
      expect(req.request.method).toBe('GET');
      req.flush(mockExams);
    });
  });
});
