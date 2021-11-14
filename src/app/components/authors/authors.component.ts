import { Component, Input, OnInit } from '@angular/core';
import { AuthorModel } from 'src/app/model/author.model';
import { SharedService } from 'src/app/services/shared.service';
import Utils from 'src/app/utils/utils';
import * as XLSX from 'xlsx';

@Component({
  selector: 'authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit {
  authors: Array<any> = [];
  authorButtonEvent: boolean = false;
  orderType: number = 0;
  orderColumn: string = '';
  utils: any;
  isSynchronization: boolean = false;

  constructor(private sharedService: SharedService) { 
    this.utils = new Utils();
  }

  ngOnInit(): void {
    this.authorButtonEvent = true;
    this.authorsSearch();
  }

  authorsSearch() {
    if(this.authors.length == 0 || this.isSynchronization) {
      this.sharedService.getAuthors().subscribe((dataAuthors: Array<AuthorModel>) => {
        this.authors = dataAuthors;
        this.isSynchronization = false;
      });
    }
  }

  sortByColumn(orderColumn:string, typeColumn: string) {
    this.orderType++
    if(this.orderType < 3) {
      this.orderType = this.orderColumn != orderColumn ? 1 : this.orderType;
      this.orderColumn = orderColumn;
      this.authors = this.utils.sortData(typeColumn, this.orderColumn, this.authors, this.orderType);
    }else {
      this.orderType = 0
    }
  }

  exportConsultToExcel() {
    this.getDataToExcelExport(this.authors)
      .then((dataExportObject: any) => {
        const wb = XLSX.utils.book_new();
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataExportObject.dataToExport);
        ws["!cols"] = dataExportObject.colsLength;
        XLSX.utils.book_append_sheet(wb, ws, 'Autores');
        XLSX.writeFile(wb, 'Autores.xlsx');
      })
      .catch((error) => {
        console.error('error in method getDataToExcelExport', error);
      });
  }

  getDataToExcelExport(dataAuthorsExport: any[]) {
    return new Promise((resolve) => {
      let dataToExport: Array<any> = [];
      let colsLength: Array<any> = [];
      dataAuthorsExport.forEach((author, index) => {
        dataToExport.push({
          "Id": author.Id,
          "Id Boock": author.IdBook,
          "Nombre": author.FirstName,
          "Apellido": author.LastName,
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
