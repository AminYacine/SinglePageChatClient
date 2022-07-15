import {TestBed} from '@angular/core/testing';

import {AuthenticateGuard} from './authenticate-guard.service';

describe('AuthenticateGuardGuard', () => {
  let guard: AuthenticateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthenticateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
