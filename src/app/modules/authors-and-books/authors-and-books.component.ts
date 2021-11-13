import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { AuthorsComponent } from 'src/app/components/authors/authors.component';
import { BooksFiltersComponent } from 'src/app/components/books-filters/books-filters.component';
import { BooksComponent } from 'src/app/components/books/books.component';

@Component({
  selector: 'authors-and-books',
  templateUrl: './authors-and-books.component.html',
  styleUrls: ['./authors-and-books.component.scss']
})
export class AuthorsAndBooksComponent implements OnInit {
  @ViewChild(AuthorsComponent, { static: false })
  public authors!: AuthorsComponent;
  @ViewChild(BooksComponent, { static: false })
  public books!: BooksComponent;

  @ViewChild(BooksFiltersComponent, { static: false })
  public booksFilters!: BooksFiltersComponent;

  @Output() signOutSession = new EventEmitter();

  buttonEvent: string = '';
  active: number = 1;
  constructor() { }

  ngOnInit(): void {
  }

  buttonClick(event: string) {
    this.buttonEvent = event;
    switch(this.buttonEvent) {
      case 'Authors':
        this.authors.authorButtonEvent = true;
        this.books.bookButtonEvent = false;
        this.booksFilters.bookFiltersButtonEvent = false;
        this.authors.authorsSearch();
      break;

      case 'Books':
        this.authors.authorButtonEvent = false;
        this.books.bookButtonEvent = true;
        this.booksFilters.bookFiltersButtonEvent = false;
        this.books.booksSearch();
      break;

      case 'BooksFilter':
        this.authors.authorButtonEvent = false;
        this.books.bookButtonEvent = false;
        this.booksFilters.bookFiltersButtonEvent = true;
        this.booksFilters.booksFiltersSearch();
      break;
    }
  }

  signOut() {
    this.signOutSession.emit();
  }

}
