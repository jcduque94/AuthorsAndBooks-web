import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorsAndBooksComponent } from './authors-and-books.component';

describe('AuthorsAndBooksComponent', () => {
  let component: AuthorsAndBooksComponent;
  let fixture: ComponentFixture<AuthorsAndBooksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorsAndBooksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthorsAndBooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
