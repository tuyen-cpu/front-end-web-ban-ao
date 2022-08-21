import { AddressesService } from './../../shared/addresses.service';
import { Address } from './../../model/address.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { StorageService } from 'src/app/service/storage.service';
import { User } from 'src/app/model/user.model';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddressComponent implements OnInit {
  isShowNewAddress: boolean = false;
  addressForm!: FormGroup;
  addressList: Address[] = [];
  public user!: User;
  constructor(private addressesService: AddressesService,private storageService: StorageService,) {}
  toggleNewAddress() {
    this.isShowNewAddress = !this.isShowNewAddress;
  }
  ngOnInit(): void {
    this.loadUser();
    this.initForm();
    this.getAllAddress();
  }
  loadUser() {
    this.user=this.storageService.getUser();
  }
  getAllAddress() {
    this.addressesService.getAddressesByUserId(this.user.id).subscribe((data) => {
      this.addressList = data;
    });
  }
  get addressFormControl() {
    return this.addressForm.controls;
  }
  onSubmit() {
    console.log(this.addressForm);
  }
  private initForm() {
    this.addressForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(2)]),
      address: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      city: new FormControl('', [Validators.required, Validators.minLength(5)]),
      phone: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(
          /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/
        ),
      ]),
    });
  }
}
