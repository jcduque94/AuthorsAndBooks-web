import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import * as moment from 'moment';
import { BooksByAuthor } from 'src/app/model/booksByAuthor';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { DateComponent } from '../date/date.component';

@Component({
  selector: 'books-filters',
  templateUrl: './books-filters.component.html',
  styleUrls: ['./books-filters.component.scss']
})
export class BooksFiltersComponent implements OnInit {
  /**ViewChild's */
  @ViewChild('startDate') startDate: DateComponent;
  @ViewChild('endDate') endDate: DateComponent;

  /**Variables globales */
  authors: Array<any> = [];
  books: Array<any> = [];
  bookFiltersButtonEvent:boolean = false;
  authorSelected: any;
  constructor(private sharedService: SharedService) { 
    this.startDate = new DateComponent();
    this.endDate = new DateComponent();
  }

  ngOnInit(): void {
    this.sharedService.getBooksFilters().subscribe((dataFilter: BooksByAuthor) => {
      this.authors = dataFilter.Author;
      this.books = dataFilter.Book.map(book => {book.PublishDate = moment(book.PublishDate).format('DD/MM/YYYY HH:mm'); return book})
    });
  }

  changeAuthor(author: any) {
    this.authorSelected = author
    console.log("autor", author);
  }

  booksFiltersSearch() {
    console.log("fecha inicial", this.startDate.date);
    console.log("fecha final", this.endDate.date);
    console.log("autor", this.authorSelected);
  }

}
