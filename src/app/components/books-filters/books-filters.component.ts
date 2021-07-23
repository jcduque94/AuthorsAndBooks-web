import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import * as moment from 'moment';
import { BooksByAuthor } from 'src/app/model/booksByAuthor';

@Component({
  selector: 'books-filters',
  templateUrl: './books-filters.component.html',
  styleUrls: ['./books-filters.component.scss']
})
export class BooksFiltersComponent implements OnInit {
  authors: Array<any> = [];
  books: Array<any> = [];
  bookFiltersButtonEvent:boolean = false;
  constructor(private sharedService: SharedService) { }

  ngOnInit(): void {
    this.sharedService.getBooksFilters().subscribe((dataFilter: BooksByAuthor) => {
      this.authors = dataFilter.Author;
      this.books = dataFilter.Book.map(book => {book.PublishDate = moment(book.PublishDate).format('DD/MM/YYYY HH:mm'); return book})
    });
  }

  booksFiltersSearch() {

  }

}
