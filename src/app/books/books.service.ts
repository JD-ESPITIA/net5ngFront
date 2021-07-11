import {Books} from './books.model';
import {Subject} from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { PaginationBooks } from './pagination-books.model';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BooksService{

  // private booksLista: Books[] = [
  //   { libroId: 1, titulo: 'Algoritmos', descripcion: 'libro basico', autor: 'Vaxi Drez', precio: 18 },
  //   { libroId: 2, titulo: 'Angular', descripcion: 'libro intermedio', autor: 'Heli Arcila', precio: 25 },
  //   { libroId: 3, titulo: 'ASP.NET', descripcion: 'Master', autor: 'Juan Arevalo', precio: 30 },
  //   { libroId: 4, titulo: 'Java', descripcion: 'Agile Libro', autor: 'John Ortiz', precio: 99 }
  // ];

  private baseUrl = environment.baseUrl;
  private booksLista: Books[] = [];
  bookSubject = new Subject<Books>();
  bookPagination: PaginationBooks;
  bookPaginationSubject = new Subject<PaginationBooks>();


  constructor(private _http: HttpClient){

  }

  obtenerLibros(libroPorPagina: number, paginaActual: number, sort: string, sortDirection: string, filterValue: any){
    // return this.booksLista.slice();
    const request = {
      pageSize: libroPorPagina,
      page: paginaActual,
      sort,
      sortDirection,
      filterValue
    };

    this._http.post<PaginationBooks>(this.baseUrl + 'api/Libro/Pagination', request ).subscribe( (response) => {
      this.bookPagination = response;
      this.bookPaginationSubject.next(this.bookPagination);
    });

  }

  obtenerActualListener(){
    return this.bookPaginationSubject.asObservable();
  }

  guardarLibro(book: Books){

    this.booksLista.push(book);
    this.bookSubject.next(book);
  }

}
