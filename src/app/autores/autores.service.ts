
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import {Autor} from './autor.model';



@Injectable({
  providedIn: 'root'
})
export class AutoresService{

  baseUrl = environment.baseUrl;
  // private autoresLista: Autor[] = [
  //     {autorId: 1, nombre: 'Vaxi', apellido: 'Drez', gradoAcademico: 'Ingeniero de Software'},
  //     {autorId: 2, nombre: 'Lorenzo', apellido: 'Ramirez', gradoAcademico: 'Matematica'},
  //     {autorId: 3, nombre: 'Juan', apellido: 'Alvarez', gradoAcademico: 'Ciencias de la Computacion'},
  //     {autorId: 4, nombre: 'Roberto', apellido: 'Arcila', gradoAcademico: 'Ingenieria de Sistemas'}
  // ];

  private autoresLista: Autor[] = [];
  private autoresSubject = new Subject<Autor[]>();

  constructor(private _http: HttpClient){

  }


  obtenerAutores(){
    // return this.autoresLista.slice();
    this._http.get<Autor[]>(this.baseUrl + 'api/libreriaAutor')
      .subscribe(data => {
        this.autoresLista = data;
        this.autoresSubject.next([...this.autoresLista]);
      });

  }

  obtenerActualListener(){
    return this.autoresSubject.asObservable();
  }


}
