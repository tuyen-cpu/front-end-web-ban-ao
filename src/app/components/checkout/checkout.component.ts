import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/model/cart-item.model';
import { Checkout } from 'src/app/model/checkout.model';
import { District, Province, Ward } from 'src/app/model/province.model';
import { User } from 'src/app/model/user.model';
import { CartService } from 'src/app/service/cart.service';
import { CheckoutService } from 'src/app/service/checkout.service';
import { StorageService } from 'src/app/service/storage.service';
import { Order } from '../account-home/account/account.component';
import { Address } from './../../model/address.model';
import { AddressesService } from './../../shared/addresses.service';
import { ProvincesApiService } from './../../shared/provinces-api.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CheckoutComponent implements OnInit {
  favoriteSeason!: string;
  voucherForm!: FormGroup;
  provinceList!: Province[];
  districtList!: District[];
  communesList!: Ward[];
  addressList: Address[] = [];
  seasons: string[] = [
    'Thanh toán khi giao hàng (COD)',
    //'Chuyển khoản qua ngân hàng (Miễn phí thanh toán)',
    // 'Chuyển khoản qua ngân hàng (VietQR) (Miễn phí thanh toán)',
    // '	Trả góp 0% lãi suất qua thẻ Visa, Master, JCB (Đơn hàng từ 3.000.000đ)',
    // 'Thanh toán online qua thẻ Visa, Master, JCB (Miễn phí thanh toán)',
  ];
  //cart
  public cartItems: CartItem[] = [];
  public totalCart: number = 0;

  //checkout
  public user: User = this.storageService.getUser();
  public shippingCost: number = 25000;
  public username: string = this.user != null ? this.user.username : "";
  public orderId: number = -1;
  public note: string = '';

  //voucher
  public discount: number = 0;
  public validVoucherCode: boolean = false;
  public submitVoucher: boolean = false;
  public vouchers: Map<string, number> = new Map<string, number>();
  public voucherCodes: string[] = [];

  //address
  public addressForm: FormGroup = new FormGroup({
    id: new FormControl(''),
    fullname: new FormControl(''),
    phone: new FormControl(''),
    country: new FormControl('Việt Nam'),
    city: new FormControl(''),
    district: new FormControl(''),
    ward: new FormControl(''),
    street: new FormControl(''),
    company: new FormControl(''),
  });
  public submittedAddress: boolean = false;

  //modal message
  public displayModalSuccess: boolean = false;
  public displayModalFail: boolean = false;
  public displayModalInfo: boolean = false;
  public displayModalInfoAddress: boolean = false;
  public displayModalLoading: boolean = false;

  constructor(
    private provincesApiService: ProvincesApiService,
    private addressesService: AddressesService,
    private cartService: CartService,
    private storageService: StorageService,
    private checkoutService: CheckoutService,
    private formBuilder: FormBuilder,
    private route: Router,
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.provincesApiService.getProvinces().subscribe((data: Province[]) => {
      this.provinceList = data;
    });

    this.getAddresses();

    //get list cart item
    this.loadListCartItem();

    //checkout
    this.favoriteSeason = this.seasons[0];

  }

  private initForm() {
    this.voucherForm = new FormGroup({
      voucherValue: new FormControl('', Validators.required),
    });

    this.addressForm = this.formBuilder.group(
      {
        id: [''],
        fullname: ['', [Validators.required]],
        phone: ['', [Validators.required]],
        country: ['Việt Nam'],
        city: ['', [Validators.required]],
        district: ['', [Validators.required]],
        ward: ['', [Validators.required]],
        street: ['', [Validators.required]],
        company: [''],
      },

    );
  }

  public get fAddress(): { [key: string]: AbstractControl } {
    return this.addressForm.controls;
  }

  onSubmitAddress(): Address {
    this.submittedAddress = true;
    let address: Address = this.addressForm.value;
    return address;
  }

  changeVoucherCode() {
    this.submitVoucher = false;
  }

  getVoucherCodes() {
    this.voucherCodes = Array.from(this.vouchers.keys());
  }

  //submit voucher
  onSubmit() {
    const code = this.voucherForm.value.voucherValue;
    if (!this.vouchers.has(code)) {
      this.checkVoucher(code);
      this.submitVoucher = true;
      this.voucherForm.reset();
    }
  }

  public loadListCartItem() {
    this.cartService.getCart().subscribe(res => {
      this.cartItems = res;
      //load total price
      this.totalCart = this.cartItems.reduce((previousValue, currentValue) => previousValue + (currentValue.quantity * currentValue.price), 0)
      if (this.totalCart > 100000000) {
        this.shippingCost = 0;
      }
    });
  }

  onChangeAddress(event: any) {
    this.addressesService
      .getAddressesById(event.target.value)
      .subscribe((data: Address) => {
        this.addressForm = this.formBuilder.group(
          {
            id: [data.id],
            fullname: [data.fullname, [Validators.required]],
            phone: [data.phone, [Validators.required]],
            country: ['Việt Nam'],
            city: [data.city, [Validators.required]],
            district: [data.district, [Validators.required]],
            ward: [data.ward, [Validators.required]],
            street: [data.street, [Validators.required]],
            company: [data.company]
          }
        )
        this.nameProvince = data.city;
        this.nameDistrict = data.district;
        this.nameCommune = data.ward;
      });
    var select = document.getElementById("customer-province") as HTMLSelectElement;
    let province = select.selectedOptions[0].text;
    this.nameProvince = province;
  }

  public nameProvince: string = "";
  onChangeProvince(event: any) {
    this.provincesApiService
      .getDistricts(event.target.value)
      .subscribe((data: Province) => {
        this.districtList = data.districts;
      });
    var select = document.getElementById("customer-province") as HTMLSelectElement;
    let province = select.selectedOptions[0].text;
    this.nameProvince = province;
  }

  public nameDistrict: string = "";
  onChangeDistrict(event: any) {
    this.provincesApiService
      .getCommunes(event.target.value)
      .subscribe((data: District) => {
        this.communesList = data.wards;
      });
    var select = document.getElementById("customer-district") as HTMLSelectElement;
    let district = select.selectedOptions[0].text;
    this.nameDistrict = district;
  }

  public nameCommune: string = "";
  onChangeCommune(event: any) {
    var select = document.getElementById("customer-ward") as HTMLSelectElement;
    let commune = select.selectedOptions[0].text;
    this.nameCommune = commune;
  }

  getAddresses() {
    if (this.user != null) {
      this.addressesService.getAddressesByUserId(this.user.id).subscribe((data) => {
        this.addressList = data;
      });
    }
  }

  //check voucher code
  public checkVoucher(code: string) {
    let value: Boolean = false;
    this.checkoutService.existsVoucher(code).subscribe(
      (response: Boolean) => {
        value = response;
        if (value == true) {
          this.validVoucherCode = true;
          this.useVoucher(code);
        } else {
          this.validVoucherCode = false;
        }
      },
      (error: HttpErrorResponse) => {
        console.log("Check voucher code: " + error.message);
      });
  }

  public useVoucher(code: string) {
    let cost: Number = 0;

    this.checkoutService.useVoucher(code).subscribe(
      (response: Number) => {
        cost = response;
        if (cost == -1) {
          this.discount += 0;
        } else {
          this.discount += cost.valueOf();
          this.vouchers.set(code, cost.valueOf());
          this.getVoucherCodes();
        }
      },
      (error: HttpErrorResponse) => {
        console.log("Use voucher code: " + error.message);
      });
  }

  getCostVoucher(code: string): number {
    return this.vouchers.get(code) as number;
  }

  cancelVoucher(code: string) {
    let cost: number = this.getCostVoucher(code);
    this.discount -= cost;
    this.vouchers.delete(code);
    this.getVoucherCodes();
  }

  public checkout() {
    //update price of items
    this.displayModalLoading = true;
    this.cartService.updatePriceCartItems();
    setTimeout(() => {
      this.displayModalLoading = false;
      this.placeAnOrder();
    }, 1000);
  }
  public placeAnOrder(): number {

    let result: number = -1;//false

    if (this.user == null) {
      this.displayModalInfo = true;
      return result;
    }
    if (this.addressForm.invalid) {
      this.displayModalInfoAddress = true;
      this.onSubmitAddress();
      return result;
    }

    //check again voucher
    this.voucherCodes.forEach(code => {
      this.checkVoucher(code);
      if (this.validVoucherCode == false) {
        this.cancelVoucher(code);
      }
    });
    let curAddress: Address = this.onSubmitAddress();
    let curNote: string = this.note;
    let curTotal: number = this.totalCart + this.shippingCost - this.discount;
    let curUserId: number = this.user.id;
    let curCartItems: CartItem[] = this.cartItems;
    let curShipCost: number = this.shippingCost;
    let curVoucherCodes: string[] = this.voucherCodes;

    let checkout: Checkout = {
      address: curAddress,
      voucherCodes: curVoucherCodes,
      shipCost: curShipCost,
      cart: curCartItems,
      userId: curUserId,
      total: curTotal,
      note: curNote,
    };
    this.checkoutService.placeAnOrder(checkout).subscribe(
      (response: Number) => {
        result = response.valueOf();
        if (result == -1) {
          this.displayModalFail = true;
          return result;
        } else {
          this.displayModalSuccess = true;
          this.orderId = result;

          //remove all cart 
          this.cartService.removeAllCartItems();
          //remove all voucher
          this.voucherCodes = [];
          this.vouchers.clear();
          //move to account or order 
          // this.route.navigate(['/account');
          return result;
        }
      },
      (error: HttpErrorResponse) => {
        console.log("Place an order: " + error.message);
        this.displayModalFail = true;
        return result;
      });
    return result;
  }

  showOrder() {
    //window.location.href = '/bill/' + this.orderId;
    this.route.navigate(['/bill/'+this.orderId]);
  }

  continueShopping() {
    //window.location.href = '/list';
    this.route.navigate(['/list']);
  }
}
