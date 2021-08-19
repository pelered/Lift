import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IspisVoznjiComponent } from './ispis-voznji.component';

describe('IspisPutovanjaComponent', () => {
  let component: IspisVoznjiComponent;
  let fixture: ComponentFixture<IspisVoznjiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IspisVoznjiComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IspisVoznjiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
