import { MainAdminComponent } from './components/admin/main-admin/main-admin.component';
import { SearchComponent } from './components/search/search.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { AccountHomeComponent } from './components/account-home/account-home.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CartComponent } from './components/cart/cart.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { ListProductComponent } from './components/list-product/list-product.component';
import { AddressComponent } from './components/address/address.component';
import { AccountComponent } from './components/account-home/account/account.component';
import { AuthGuardService } from './service/auth-guard.service';
import { CheckoutGuardService } from './service/checkout-guard.service';
import { BillComponent } from './components/bill/bill.component';
import { ProductManagerComponent } from './components/admin/product-manager/product-manager.component';
import { UserManagerComponent } from './components/admin/user-manager/user-manager.component';
import { BillManagerComponent } from './components/admin/bill-manager/bill-manager.component';
import { VoucherManagerComponent } from './components/admin/voucher-manager/voucher-manager.component';
import { CategoryManagerComponent } from './components/admin/category-manager/category-manager.component';
import { CommentManagerComponent } from './components/admin/comment-manager/comment-manager.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { RoleGuardService } from './service/role-guard.service';
import { GroupProductComponent } from './components/admin/group-product/group-product.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    // pathMatch: 'full',
  },
  // { path: '**', component: HomeComponent },
  { path: 'list/:cateId', component: ListProductComponent },
  { path: 'cart', component: CartComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'reset_password', component: ForgotPasswordComponent },
  { path: 'list', component: ListProductComponent },
  {
    path: 'account',
    component: AccountHomeComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: '',
        component: AccountComponent,
      },
      {
        path: 'address',
        component: AddressComponent,
      },
    ],
  },
  { path: 'product/:id', component: DetailProductComponent },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [CheckoutGuardService],
  },
  {
    path: 'bill/:id',
    component: BillComponent,
    canActivate: [AuthGuardService],
  },
  { path: 'search', component: SearchComponent },
  {
    path: 'admin',
    component: MainAdminComponent,
    children: [
      { path: '', redirectTo: 'product', pathMatch: 'full' },

      {
        path: 'user',
        component: UserManagerComponent,
      },
      {
        path: 'bill',
        component: BillManagerComponent,
      },
      {
        path: 'voucher',
        component: VoucherManagerComponent,
      },
      {
        path: 'category',
        component: CategoryManagerComponent,
      },
      {
        path: 'comment',
        component: CommentManagerComponent,
      },
      {
        path: 'group-product',
        component: GroupProductComponent,
      },
    ],
    canActivateChild: [RoleGuardService],
    canActivate: [RoleGuardService],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
