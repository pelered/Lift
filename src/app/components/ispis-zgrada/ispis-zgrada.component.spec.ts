import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IspisZgradaComponent } from './ispis-zgrada.component';

describe('IspisZgradaComponent', () => {
  let component: IspisZgradaComponent;
  let fixture: ComponentFixture<IspisZgradaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IspisZgradaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IspisZgradaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
