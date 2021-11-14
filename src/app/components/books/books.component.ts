import { Component, Input, OnInit } from '@angular/core';
import { SharedService } from 'src/app/services/shared.service';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { BooksModel } from 'src/app/model/books.model';
import Utils from 'src/app/utils/utils';

@Component({
  selector: 'books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  books: Array<any> = [];
  bookButtonEvent:boolean = false;
  orderType: number = 0;
  orderColumn: string = '';
  utils: any;
  isSynchronization: boolean = false;

  constructor(private sharedService: SharedService) { 
    this.utils = new Utils();
  }

  ngOnInit(): void {
  }

  booksSearch() {
    if(this.books.length == 0 || this.isSynchronization) {
      this.sharedService.getBooks().subscribe((dataBooks: Array<BooksModel>) => {
        this.books = dataBooks.map(book => {book.PublishDateOrder = moment(book.PublishDate).format('DD/MM/YYYY HH:mm'); return book});
        this.isSynchronization = false;
      });
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

  exportConsultToExcel() {
    this.getDataToExcelExport(this.books)
      .then((dataExportObject: any) => {
        const wb = XLSX.utils.book_new();
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExportObject.dataToExport);
        ws["!cols"] = dataExportObject.colsLength;
        XLSX.utils.book_append_sheet(wb, ws, 'Libros');
        XLSX.writeFile(wb, 'Libros.xlsx');
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
          "N° Paginas": book.PageCount,
          "Extracto": book.Excerpt,
          "Fecha Publicación": book.PublishDate
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
