import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../common/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private _baseUrl = 'http://localhost:8080/api/products';
  private _categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private _httpClient: HttpClient) { }

  getProductListPaginate(thePage: number, 
    thePageSize: number): Observable<GetResponseProducts> {
      const paginationUrl = `${this._baseUrl}?page=${thePage}&size=${thePageSize}`;

      return this._httpClient.get<GetResponseProducts>(paginationUrl);
  }

  getProductsList(): Observable<Product[]> {
    return this._httpClient.get<GetResponseProducts>(this._baseUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductListByCategoryIdPaginate(thePage: number, 
    thePageSize: number,
    theCategoryId: number): Observable<GetResponseProducts> {
      const paginationUrlByCategory = `${this._baseUrl}/search/findByCategoryId?id=${theCategoryId}`
      + `&page=${thePage}&size=${thePageSize}`;

      return this._httpClient.get<GetResponseProducts>(paginationUrlByCategory);
  }

  getProductListByCategoryId(theCategoryId: number): Observable<Product[]> {

    // @TODO: butuh membuat URL berdsarkan id kategori
    const searchUrl = `${this._baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this._httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductMenuCategories(): Observable<ProductCategory[]> {
    return this._httpClient.get<GetResponseProductCategory>(this._categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchUrl = `${this._baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this._httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products));
  }

  searchProductsPaginate(theKeyword: string,
    thePage: number,
    thePageSize: number): Observable<GetResponseProducts> {
    const searchPaginationUrl = `${this._baseUrl}/search/findByNameContaining?name=${theKeyword}`
    + `&page=${thePage}&size=${thePageSize}`;

    return this._httpClient.get<GetResponseProducts>(searchPaginationUrl);
  }

  getProductDetails(theProductId: number): Observable<Product> {
    const productDetailsUrl = `${this._baseUrl}/${theProductId}`;
    return this._httpClient.get<Product>(productDetailsUrl);
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  } 
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
