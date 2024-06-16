import { TestBed } from '@angular/core/testing';

import { HttpGatewayService } from './http-gateway.service';

describe('HttpGatewayService', () => {
  let service: HttpGatewayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpGatewayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
