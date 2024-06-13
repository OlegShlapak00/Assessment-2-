import { TestBed } from '@angular/core/testing';

import { UsersResolver } from './users.resolver';
import {AuthService} from "./auth.service";
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";
import {of} from "rxjs";

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUsers']);

    TestBed.configureTestingModule({
      providers: [
        UsersResolver,
        { provide: AuthService, useValue: mockAuthService }
      ]
    });

    resolver = TestBed.inject(UsersResolver);
    route = new ActivatedRouteSnapshot();
    state = {} as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve user data using AuthService', () => {
    const mockUsers = [{ username: 'user1' }, { username: 'user2' }];
    mockAuthService.getUsers.and.returnValue(of(mockUsers));

    resolver.resolve(route, state).subscribe(users => {
      expect(users).toEqual(mockUsers);
    });

    expect(mockAuthService.getUsers).toHaveBeenCalled();
  });
});
