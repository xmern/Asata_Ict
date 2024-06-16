// http-gateway.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserDataService } from './userauth/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class HttpGatewayService {
  private baseUrl: string = 'http://192.168.0.197:8000/api'; // Replace with your server's base URL
  headers:any
  constructor(private http: HttpClient, private userdata:UserDataService) {}
  private getUploadHeaders(): HttpHeaders {
    this.headers= {
      'Content-Type': "multipart/form-data;boundary=${formData.boundary}"
      // Add other headers here if needed, like authorization tokens
    }
    if (this.userdata.getUser()){
      this.headers= {
        
        'Cookies':"jwt="+this.userdata.getUser()?.jwt
      }      

    }
    return new HttpHeaders(
      this.headers
    );
  }

  private getHeaders(): HttpHeaders {
    this.headers= {
      'Content-Type': 'application/json'
      // Add other headers here if needed, like authorization tokens
    }
    if (this.userdata.getUser()){
      this.headers= {
        'Content-Type': 'application/json',
        'Cookies':"jwt="+this.userdata.getUser()?.jwt
      }      

    }
    return new HttpHeaders(
      this.headers
    );
  }

  public get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, { headers: this.getHeaders() });
  }

  public post<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, { headers: this.getHeaders() });
  }

  public put<T>(endpoint: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, body, { headers: this.getHeaders() });
  }

  public delete<T>(endpoint: string): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, { headers: this.getHeaders() });
  }
  // custom methods
  public upload<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, body, { headers: this.getUploadHeaders() });
  }  
}
