import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Purchase } from '../common/purchase';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private _purchaseUrl = 'http://localhost:8080/api/checkout/purchase';

  constructor(private _httpClient: HttpClient) { }

  placeOrder(purchase: Purchase): Observable<any> {
    return this._httpClient.post<Purchase>(this._purchaseUrl, purchase);
  }
}
