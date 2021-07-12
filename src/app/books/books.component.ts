import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BooksService } from './books.service';
import { Books } from './books.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import {BookNuevoComponent} from './book-nuevo.component';
import {Subscription} from 'rxjs';
import { PaginationBooks } from './pagination-books.model';


@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css'],
})
export class BooksComponent implements OnInit, AfterViewInit, OnDestroy {
  bookData: Books[] = [];
  desplegarColumnas = ['titulo', 'descripcion', 'autor', 'precio'];
  dataSource = new MatTableDataSource<Books>();
  @ViewChild(MatSort) ordenamiento: MatSort;
  @ViewChild(MatPaginator) paginacion: MatPaginator;

  // paginador
  totalLibros = 0;
  librosPorPagina = 2;
  paginaCombo = [1,2,5,10];
  paginaActual = 1;
  sort = "titulo";
  sortDirection = 'asc';
  filterValue = null;
  private bookSubscription: Subscription;

  constructor(private booksService: BooksService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.booksService.obtenerLibros(this.librosPorPagina, this.paginaActual, this.sort, this.sortDirection, this.filterValue);
    this.booksService.obtenerActualListener().subscribe( (pagination:PaginationBooks) => {
      this.dataSource = new MatTableDataSource<Books>(pagination.data);
      this.totalLibros = pagination.totalRows;
    });
    // this.dataSource.data = this.booksService.obtenerLibros();
    // this.bookSubscription = this.booksService.bookSubject.subscribe(() => {
      // this.dataSource.data = this.booksService.obtenerLibros();
    // });
  }

  eventoPaginador(event: PageEvent){
    this.librosPorPagina = event.pageSize;
    this.paginaActual = event.pageIndex +1;
    this.booksService.obtenerLibros(this.librosPorPagina, this.paginaActual, this.sort, this.sortDirection, this.filterValue);
  }

  hacerFiltro(filtro: string){
    this.dataSource.filter = filtro;
  }

  abrirDialog(){
    const dialogRef = this.dialog.open(BookNuevoComponent,{
      width: '550px'
    });

    dialogRef.afterClosed().subscribe( ()=>{
      this.booksService.obtenerLibros(this.librosPorPagina, this.paginaActual, this.sort, this.sortDirection, this.filterValue);
    });
  }



  ngAfterViewInit(){
    this.dataSource.sort = this.ordenamiento;
    this.dataSource.paginator = this.paginacion;
  }

  ngOnDestroy(){
    this.bookSubscription.unsubscribe();
  }

}
