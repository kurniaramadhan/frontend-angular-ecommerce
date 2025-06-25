import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  product!: Product;

  constructor(private _productService: ProductService,
    private _cartService: CartService, 
    private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._route.paramMap.subscribe(() => {
      this.handleProductDetails();
    });
  }

  handleProductDetails() {
    //ambil parameter id dan konversi ke number
    const theProductId = +this._route.snapshot.paramMap.get('id')!;
    
    this._productService.getProductDetails(theProductId).subscribe(
      data => {
        this.product = data;
      }
    );
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);
    const theCartitem = new CartItem(theProduct);

    this._cartService.addToCart(theCartitem);
  }

}
