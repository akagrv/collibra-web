import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollibraComponent } from './collibra.component';

describe('CollibraComponent', () => {
  let component: CollibraComponent;
  let fixture: ComponentFixture<CollibraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollibraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollibraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
