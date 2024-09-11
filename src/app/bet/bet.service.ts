import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { Observable, lastValueFrom, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BetService {
  private apiUrl = environment.apiEndpoint;

  constructor(private http: HttpClient) { }

  pushBet(_winner: string, _mount: number): Observable<any> {
    const betData = {
      winner: _winner,
      mount: _mount
    }
    return this.http.post(`${this.apiUrl}`, betData);
  }

  async getStats(_winner: string): Promise<any> {
    const request$ = this.http.get(`${this.apiUrl}/stats?winner=` + _winner).pipe(take(1));

    return await lastValueFrom(request$);
  }
}
