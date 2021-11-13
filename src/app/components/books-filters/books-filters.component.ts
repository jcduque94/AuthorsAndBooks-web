import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import * as moment from 'moment';
import { DateComponent } from '../date/date.component';
import { AuthorModel } from 'src/app/model/author.model';
import { BooksFilterModel } from 'src/app/model/booksFilter.model';
import { BooksModel } from 'src/app/model/books.model';

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
  authorNameSelected: string = "Seleccione autor";
  search: boolean = false;
  startDateMessage: boolean = false;
  endDateMessage: boolean = false;
  constructor(private sharedService: SharedService) { 
    this.startDate = new DateComponent();
    this.endDate = new DateComponent();
  }

  ngOnInit(): void {
    this.sharedService.getAuthors().subscribe((authors: Array<AuthorModel>) => {
      this.authors = authors;
    });
  }

  changeAuthor(author: any) {
    this.authorSelected = author
    this.authorNameSelected = this.authorSelected.FirstName;
    console.log("autor", author);
  }

  booksFiltersSearch() {
    if(this.startDate.date != undefined && this.endDate.date != undefined) {
      this.search = true;
      let booksFilters: BooksFilterModel = new BooksFilterModel();
      booksFilters.StartDate = this.startDate.date.year + '-' + this.startDate.date.month + '-' + this.startDate.date.day;
      booksFilters.EndDate = this.endDate.date.year + '-' + this.endDate.date.month + '-' + this.endDate.date.day;
      booksFilters.IdBook = this.authorSelected != undefined ? this.authorSelected.IdBook.toString() : null;
      this.sharedService.getBooksFilters(booksFilters).subscribe((books: Array<BooksModel>) => {
        this.search = false;
        this.books = books.map(book => {book.PublishDate = moment(book.PublishDate).format('DD/MM/YYYY HH:mm'); return book});
        console.log("libros filtrados", this.books);
      });
    }else {
      this.startDateMessage = this.startDate.date == undefined;
      this.endDateMessage = this.endDate.date == undefined;
    }
  }

  cleanFilters() {
    this.startDate.date = undefined;
    this.endDate.date = undefined;
    this.authorSelected = undefined;
    this.authorNameSelected = "Seleccione autor";
    this.startDateMessage = false;
    this.endDateMessage = false;
  }

}
