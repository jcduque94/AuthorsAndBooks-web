import { Component, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';
import { AuthorsComponent } from 'src/app/components/authors/authors.component';
import { BooksFiltersComponent } from 'src/app/components/books-filters/books-filters.component';
import { BooksComponent } from 'src/app/components/books/books.component';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'authors-and-books',
  templateUrl: './authors-and-books.component.html',
  styleUrls: ['./authors-and-books.component.scss']
})
export class AuthorsAndBooksComponent implements OnInit {
  @ViewChild(AuthorsComponent)
  public authors!: AuthorsComponent;
  @ViewChild(BooksComponent)
  public books!: BooksComponent;

  @ViewChild(BooksFiltersComponent)
  public booksFilters!: BooksFiltersComponent;

  @ViewChild("modalSusccess") public modalSusccess!: ModalComponent;

  @Output() signOutSession = new EventEmitter();

  buttonEvent: string = '';
  active: number = 1;
  isSynchronization: boolean = false;
  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
  }

  buttonClick(event: string) {
    this.buttonEvent = event;
    switch (this.buttonEvent) {
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

  synchronizationDB() {
    this.isSynchronization = true;
    this.sharedService.synchronization().subscribe((isSynchronization: Boolean) => {
      this.isSynchronization = false;
      this.authors.isSynchronization = true;
      this.books.isSynchronization = true;
      this.buttonClick(this.buttonEvent);
      this.modalSusccess.showModal();
    });
  }

  signOut() {
    this.signOutSession.emit();
  }

}
