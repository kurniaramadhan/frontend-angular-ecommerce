import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { CartItem } from 'src/app/common/cart-item';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;
  //page = 4;

  // property baru untuk pagination
  thePageNumber: number = 1;
  thePageSize: number = 3;
  theTotalElements: number = 0;


  constructor(private _productService: ProductService, 
    private _cartService: CartService,
    private _route: ActivatedRoute) { }

  ngOnInit(): void {
    this._route.paramMap.subscribe(() => {
      this.listProducts();
    });
  }

  // listProducts() {
  //   this.searchMode = this._route.snapshot.paramMap.has('keyword');
  //   if (this.searchMode) {
  //     this.handleSearchProducts();
  //   } else {
  //     this.handleListProducts();
  //   }
    
  // }

  listProducts() {
    this.searchMode = this._route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProductsPaginate();
    } else {
      this.handleListProducts();
    }
  }

  // handleSearchProducts() {
  //   const theKeyword: string = this._route.snapshot.paramMap.get('keyword')!;

  //   this._productService.searchProducts(theKeyword).subscribe(
  //     data => {
  //       this.products = data;
  //     }
  //   );
  // }

  handleSearchProductsPaginate() {
    const theKeyword: string = this._route.snapshot.paramMap.get('keyword')!;

    this._productService.searchProductsPaginate(theKeyword,
      this.thePageNumber - 1,
      this.thePageSize).subscribe(
      data => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number + 1;
        this.thePageSize = data.page.size;
        this.theTotalElements = data.page.totalElements;
      }
    );
  }

  handleListProducts() {
    const hasCategoryId: boolean = this._route.snapshot.paramMap.has('id');

    if (hasCategoryId) {
      //get parameter id sebagai string, kemudian konversi ke number menggunakan tanda +
      this.currentCategoryId = +this._route.snapshot.paramMap.get('id')!;

      if (this.previousCategoryId != this.currentCategoryId) {
        this.thePageNumber = 1;
      }

      this.previousCategoryId = this.currentCategoryId;
      console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

      this._productService.getProductListByCategoryIdPaginate(this.thePageNumber - 1,
        this.thePageSize,
        this.currentCategoryId).subscribe(
        data => {
          this.products = data._embedded.products;
          this.thePageNumber = data.page.number + 1;
          this.thePageSize = data.page.size;
          this.theTotalElements = data.page.totalElements;
        }
      )
    } else {
      // this._productService.getProductsList().subscribe(
      //   data => {
      //     this.products = data;
      //   }
      // )
      console.log(`thePageNumber=${this.thePageNumber}`);
      this._productService.getProductListPaginate(this.thePageNumber - 1,
        this.thePageSize).subscribe(
          data => {
            this.products = data._embedded.products;
            this.thePageNumber = data.page.number + 1;
            this.thePageSize = data.page.size;
            this.theTotalElements = data.page.totalElements;
          }
        );
    }
  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(theProduct: Product) {
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);
    const theCartitem = new CartItem(theProduct);

    this._cartService.addToCart(theCartitem);
  }
}
