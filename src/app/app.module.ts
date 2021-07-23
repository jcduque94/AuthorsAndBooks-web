import { APP_BASE_HREF } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthorsAndBooksComponent } from './modules/authors-and-books/authors-and-books.component';
import { AuthorsComponent } from './components/authors/authors.component';
import { BooksComponent } from './components/books/books.component';
import { BooksFiltersComponent } from './components/books-filters/books-filters.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthorsAndBooksComponent,
    AuthorsComponent,
    BooksComponent,
    BooksFiltersComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: '/authorsAndBooks'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
