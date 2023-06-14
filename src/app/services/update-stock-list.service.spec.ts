import { TestBed } from '@angular/core/testing';

import { UpdateStockListService } from './update-stock-list.service';

describe('UpdateStockListService', () => {
  let service: UpdateStockListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UpdateStockListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
