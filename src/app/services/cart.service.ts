import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  //storage: Storage = sessionStorage;
  storage: Storage = localStorage;

  constructor() {
    // baca data dari storage
    let data = JSON.parse(this.storage.getItem('cartItems')!);
    if (data != null) {
      this.cartItems = data;
      // hitung total berdasarkan data yang dibaca dari storage
      this.computeCartTotals();
    }
  }

  addToCart(theCartitem: CartItem) {
    //Algoritma:
    //1. Cek apakah sudah ada item di dalam Cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      //2. Cari item di dalam Cart berdasarkan id
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartitem.id);

      //3. Cek, apakah ditemukan
      alreadyExistsInCart = (existingCartItem != undefined);
    }
    if (alreadyExistsInCart) {
      //4. Increment quantity
      existingCartItem.quantity++;
    } else {
      //5. Tambahkan item ke dalam array
      this.cartItems.push(theCartitem);
    }
    //6. Hitung Cart Totals
    this.computeCartTotals();
  }

  computeCartTotals() {
    let totalPriceValue: number = 0.0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    //Publish data nilai dari totalPrice dan totalQuantity yang baru
    //Maka, subscriber menerima data tersebut
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    this.logCartData(totalPriceValue, totalQuantityValue);
    
    // persist cart data berdasarkan key value
    this.persistCartItems();
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Content of the cart: ');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity: ${tempCartItem.quantity}, unitPrice: ${tempCartItem.unitPrice}`);
    }
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('---');
  }

  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if (theCartItem.quantity == 0) {
      this.remove(theCartItem);
    } else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {
    //ambil indeks item dari array
    for (let tempCartItem of this.cartItems) {
      const itemIndex = this.cartItems.findIndex(
        tempCartItem => tempCartItem.id == theCartItem.id
      );

      //jika ditemukan, maka hapus item dari array berdasarkan index
      if (itemIndex > -1) {
        this.cartItems.splice(itemIndex, 1);
        this.computeCartTotals();
      }
    }
  }
}