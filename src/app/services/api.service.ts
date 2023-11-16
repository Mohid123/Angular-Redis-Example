import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, retry, tap, throwError } from 'rxjs';

const headersConfig = {
  'LOCALE': 'en',
  'Accept': 'application/json',
  'access-control-allow-origin': '*'
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  apiUrl: string = 'http://localhost:3000'
  constructor(private http: HttpClient) { }

  private setHeaders(): HttpHeaders {
    const header = {
      ...headersConfig,
      'Content-Type': 'application/json',
    };
    return new HttpHeaders(header);
  }

  getAllPatients(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, {headers: this.setHeaders()}).pipe(
      retry(1),
      map((res: any) => {
        return res.data
      }),
      catchError((err: HttpErrorResponse) => {
        throw of(err);
      })
    )
  }

  getSinglePatient(id: string | number): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/${id}`, {headers: this.setHeaders()}).pipe(
      retry(1),
      map((res: any) => {
        return res.data
      }),
      catchError((err: HttpErrorResponse) => {
        throw of(err);
      })
    )
  }

  addPatient(body: Object): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, JSON.stringify(body), {
      headers: this.setHeaders()
    }).pipe(
      retry(1),
      map((res: any) => {
        return res
      }),
      catchError((err: HttpErrorResponse | any) => {
        throw of(err);
      })
    )
  }

  deletePatient(id: string | number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, {
      headers: this.setHeaders()
    }).pipe(
      retry(1),
      map((res: any) => {
        return res
      }),
      catchError((err: HttpErrorResponse | any) => {
        throw of(err);
      })
    )
  }
}
