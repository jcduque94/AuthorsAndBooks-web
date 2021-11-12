import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http"
import { Observable } from "rxjs";
@Injectable({
    providedIn: 'root'
})
export class SharedService {
    
    constructor(private httpClient: HttpClient) {}

    getAuthors(): Observable<any[]> {
        return this.httpClient.get<any>('http://localhost:1732/author');
    }

    getBooks(): Observable<any> {
        return this.httpClient.get('http://localhost:1732/book');
    }

    getBooksFilters(): Observable<any> {
        return this.httpClient.get('http://localhost:1732/author/GetBooksByAuthorAndDate');
    }
}