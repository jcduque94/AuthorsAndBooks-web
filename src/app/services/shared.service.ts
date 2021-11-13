import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http"
import { Observable } from "rxjs";
import { BooksFilterModel } from "../model/booksFilter.model";
import { UserModel } from "../model/user.model";
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

    getBooksFilters(filters: BooksFilterModel): Observable<any> {
        return this.httpClient.post('http://localhost:1732/book/GetBooksByAuthorAndDate', filters);
    }

    authenticationUser(user: UserModel): Observable<any> {
        return this.httpClient.post('http://localhost:1732/user/Authentication', user);
    }
}