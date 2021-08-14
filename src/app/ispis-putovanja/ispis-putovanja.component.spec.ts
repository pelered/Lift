import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IspisPutovanjaComponent } from './ispis-putovanja.component';

describe('IspisPutovanjaComponent', () => {
  let component: IspisPutovanjaComponent;
  let fixture: ComponentFixture<IspisPutovanjaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IspisPutovanjaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IspisPutovanjaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
