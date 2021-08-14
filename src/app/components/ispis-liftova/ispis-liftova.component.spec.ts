import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IspisLiftovaComponent } from './ispis-liftova.component';

describe('IspisLiftovaComponent', () => {
  let component: IspisLiftovaComponent;
  let fixture: ComponentFixture<IspisLiftovaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IspisLiftovaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IspisLiftovaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
