import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0.0;
  totalQuantity: number = 0;

  constructor(private _cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    //tampung data cart item dari cart service pada array
    this.cartItems = this._cartService.cartItems;

    //subscribe ke cart totalPrice
    this._cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    //subscribe ke cart totalQuantity
    this._cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    //hitung cart total price dan cart total quantity
    this._cartService.computeCartTotals();
  }

  incrementQuantity(theCartItem: CartItem) {
    this._cartService.addToCart(theCartItem);
  }

  decrementQuantity(theCartItem: CartItem) {
    this._cartService.decrementQuantity(theCartItem);
  }

  remove(theCartItem: CartItem) {
    this._cartService.remove(theCartItem);
  }

}

