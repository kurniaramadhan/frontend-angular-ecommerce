import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { DropdownFormService } from 'src/app/services/dropdown-form.service';
import { CustomValidators } from 'src/app/validators/custom-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  billingAddressStates: State[] = [];
  shippingAddressStates: State[] = [];

  totalQuantity: number = 0;
  totalPrice: number = 0.0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  countries: Country[] = [];

  constructor(private _formBuilder: FormBuilder,
    private _dropdownFormService: DropdownFormService,
    private _cartService: CartService,
    private _checkoutService: CheckoutService,
    private _router: Router) { }

  ngOnInit(): void {
    this.updateCartTotal();

    this.checkoutFormGroup = this._formBuilder.group({
      customer: this._formBuilder.group({
        firstName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace
        ]),
        email: new FormControl('', [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')
        ]),
        phone: new FormControl('', [Validators.minLength(2), Validators.maxLength(14)])
      }),
      shippingAddress: this._formBuilder.group({
        country: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace
        ]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
          CustomValidators.notOnlyWhitespace
        ]),
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace
        ])
      }),
      billingAddress: this._formBuilder.group({
        country: new FormControl('', [Validators.required]),
        state: new FormControl('', [Validators.required]),
        city: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace
        ]),
        zipCode: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
          CustomValidators.notOnlyWhitespace
        ]),
        street: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace
        ])
      }),
      creditCard: this._formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          CustomValidators.notOnlyWhitespace
        ]),
        cardNumber: new FormControl('', [
          Validators.required,
          Validators.pattern('[0-9]{16}')
        ]),
        securityCode: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          CustomValidators.notOnlyWhitespace
        ]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    // Mengambil data credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this._dropdownFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // Mengambil data credit card years
    this._dropdownFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card years: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    // Menarik data countries
    this._dropdownFormService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    );
  }

  handleMonthsandYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    // Jika tahun saat ini == tahun yang dipilih maka mulai dengan bulan saat ini
    // Jika tidak, maka mulai dari bulan 1
    let startMonth: number;
    if (currentYear == selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this._dropdownFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.iso2;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this._dropdownFormService.getStates(countryCode).subscribe(
      data => {

        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        // pilih item pertama sebagai default
        formGroup.get('state').setValue(data[0]);
      }
    );
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }
  get phone() { return this.checkoutFormGroup.get('customer.phone'); }

  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressZipcode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressZipcode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get cardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get nameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get cardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get securityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }

  copyToBillingAddress(event) {
    if (event.target.checked) {
      console.log('Checked.................');
      this.checkoutFormGroup.controls['billingAddress'].setValue(
        this.checkoutFormGroup.controls['shippingAddress'].value
      );
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];
    }
  }

  updateCartTotal() {
    //Subscribe ke cart totalPrice
    this._cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    //Subscribe ke cart totalQuantity
    this._cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

  onSubmit() {
    console.log("Handling the submit button");
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart item
    const cartItems = this._cartService.cartItems;

    // create orderItems dari cartItems
    /*
    cara lama:
      let orderItems: OrderItem[] = [];
      for (let i=0; i < cartItems.length; i++) {
        orderItems1[i] = new OrderItem(cartItems[i]);
      }
    */

    /* cara baru: */
    let orderItems: OrderItem[] = cartItems.map(
      tempCartItem => new OrderItem(tempCartItem)
    )

    // set up purchase
    let purchase = new Purchase();

    // pupulate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    purchase.shippingAddress.country = shippingCountry.name;
    purchase.shippingAddress.state = shippingState.name;

    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    console.log(billingCountry.name);
    console.log(billingState.name);
    purchase.billingAddress.country = billingCountry.name;
    purchase.billingAddress.state = billingState.name;

    // populate purchase - order dan orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    // panggil REST API melalui CheckoutService
    this._checkoutService.placeOrder(purchase).subscribe({
      next: response => {
        alert(`Pesanan kamu sudah diterima.\nOrder tracking number: ${response.orderTrackingNumber}`);

        // reset cart
        this.resetCart();

      },
      error: err => {
        alert(`Telah terjadi error: ${err.message}`);
      }
    }
    );
  }

  resetCart() {
    // reset data pada cart
    this._cartService.cartItems = [];
    this._cartService.totalPrice.next(0);
    this._cartService.totalQuantity.next(0);
    
    // reset form
    this.checkoutFormGroup.reset();

    // navigasikan kembali ke halaman product
    this._router.navigateByUrl("/products");
  }
}
