import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalPrice: number = 0.0;
  totalQuantity: number = 0;

  constructor(private _cartService: CartService) { }

  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus() {
    //Subscribe ke cart totalPrice
    this._cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    //Subscribe ke cart totalQuantity
    this._cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

}
