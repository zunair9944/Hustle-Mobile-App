import { TestBed } from '@angular/core/testing';

import { SideHustlesService } from './side-hustles.service';

describe('SideHustlesService', () => {
  let service: SideHustlesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SideHustlesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
