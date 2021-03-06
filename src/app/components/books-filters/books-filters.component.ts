import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import * as moment from 'moment';
import { DateComponent } from '../date/date.component';
import { AuthorModel } from 'src/app/model/author.model';
import { BooksFilterModel } from 'src/app/model/booksFilter.model';
import { BooksModel } from 'src/app/model/books.model';
import * as XLSX from 'xlsx';
import Utils from 'src/app/utils/utils';

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
  startDateMessage: string = '';
  endDateMessage: string = '';
  utils: any;
  orderType: number = 0;
  orderColumn: string = '';
  spinnerShow: boolean = false;
  constructor(private sharedService: SharedService) { 
    this.startDate = new DateComponent();
    this.endDate = new DateComponent();
    this.utils = new Utils();
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

  validateFilters() {
      if(this.startDate.date != undefined && this.endDate.date != undefined) {
        let startDate = this.startDate.date.year != undefined && this.startDate.date.month && this.startDate.date.day;
        let endDate = this.endDate.date.year != undefined && this.endDate.date.month != undefined && this.endDate.date.day;
        if(!startDate) {this.startDateMessage = 'La Fecha de inicio no puede estar vac??a ni incompleta.'}
        if(!endDate) {this.endDateMessage = 'La Fecha fin no puede estar vac??a ni incompleta.'}
        if(startDate && endDate) {
          let startDateCompare = moment(new Date(this.startDate.date.year + '-' + this.startDate.date.month + '-' + this.startDate.date.day)).format('MM-DD-YYYY');
          let endDateCompare = moment(new Date(this.endDate.date.year + '-' + this.endDate.date.month + '-' + this.endDate.date.day)).format('MM-DD-YYYY');
          this.startDateMessage = startDateCompare > endDateCompare ? 'La Fecha de inicio debe ser menor que la Fecha fin.' : '';
          this.endDateMessage = '';
        }
      }else {
        this.startDateMessage = this.startDate.date == undefined ? 'La Fecha de inicio es obligatioria.' : '';
        this.endDateMessage = this.endDate.date == undefined ? 'La Fecha fin es obligatioria.' : '';
        return false
      }
    return this.startDateMessage == '' && this.endDateMessage == '';
  }

  booksFiltersSearch() {
    if(this.startDate != undefined && this.endDate != undefined) {
      if(this.validateFilters() && this.startDate.date != undefined && this.endDate.date != undefined) {
        this.search = true;
        this.spinnerShow = true;
        let booksFilters: BooksFilterModel = new BooksFilterModel();
        booksFilters.StartDate = this.startDate.date.year + '-' + this.startDate.date.month + '-' + this.startDate.date.day;
        booksFilters.EndDate = this.endDate.date.year + '-' + this.endDate.date.month + '-' + this.endDate.date.day;
        booksFilters.IdBook = this.authorSelected != undefined ? this.authorSelected.IdBook.toString() : null;
        this.sharedService.getBooksFilters(booksFilters).subscribe((books: Array<BooksModel>) => {
          this.search = false;
          this.spinnerShow = false;
          this.books = books.map(book => {book.PublishDateOrder = moment(book.PublishDate).format('DD/MM/YYYY HH:mm'); return book});
          console.log("libros filtrados", this.books);
        });
      }
    }
  }

  sortByColumn(orderColumn:string, typeColumn: string) {
    this.orderType++
    if(this.orderType < 3) {
      this.orderType = this.orderColumn != orderColumn ? 1 : this.orderType;
      this.orderColumn = orderColumn;
      this.books = this.utils.sortData(typeColumn, this.orderColumn, this.books, this.orderType);
    }else {
      this.orderType = 0
    }
  }

  cleanFilters() {
    this.startDate.date = undefined;
    this.endDate.date = undefined;
    this.authorSelected = undefined;
    this.authorNameSelected = "Seleccione autor";
    this.startDateMessage = '';
    this.endDateMessage = '';
  }

  exportConsultToExcel() {
    this.getDataToExcelExport(this.books)
      .then((dataExportObject: any) => {
        const wb = XLSX.utils.book_new();
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExportObject.dataToExport);
        ws["!cols"] = dataExportObject.colsLength;
        XLSX.utils.book_append_sheet(wb, ws, 'Libros por autor');
        XLSX.writeFile(wb, 'Libros por autor.xlsx');
      })
      .catch((error) => {
        console.error('error in method getDataToExcelExport', error);
      });
  }

  getDataToExcelExport(dataBooksExport: any[]) {
    return new Promise((resolve) => {
      let dataToExport: Array<any> = [];
      let colsLength: Array<any> = [];
      dataBooksExport.forEach((book, index) => {
        dataToExport.push({
          "Id": book.Id,
          "Titulo": book.Title,
          "Descripcion": book.Description,
          "N?? Paginas": book.PageCount,
          "Extracto": book.Excerpt,
          "Fecha Publicaci??n": book.PublishDate
        });
        let keysData = Object.keys(dataToExport[0]);
        keysData.forEach((name, i) => {
          if (index > 0 && dataToExport[index][name] != undefined && dataToExport[index][name] != null) {
            colsLength[i].width = colsLength[i].width < dataToExport[index][name].length ? dataToExport[index][name].length + 2 : colsLength[i].width;
          } else if (index == 0) {
            if (dataToExport[index][name] != undefined && dataToExport[index][name] != null) {
              colsLength.push({ width: dataToExport[index][name].length > name.length ? dataToExport[index][name].length : name.length });
            } else {
              colsLength.push({ width: name.length + 2 });
            }
          }
        });
      });
      resolve({ "dataToExport": dataToExport, "colsLength": colsLength });
    });
  }

}
