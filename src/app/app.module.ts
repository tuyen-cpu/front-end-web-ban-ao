import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { LayoutModule } from '@angular/cdk/layout';

//Components
import { ItemProductComponent } from './components/item-product/item-product.component';
import { ListProductComponent } from './components/list-product/list-product.component';
import { ProductListHomeComponent } from './components/product-list-home/product-list-home.component';

//primeNg
import { PaginatorModule } from 'primeng/paginator';
import { RatingModule } from 'primeng/rating';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { TableModule } from 'primeng/table';
import { FileUploadModule } from 'primeng/fileupload';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SkeletonModule } from 'primeng/skeleton';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ChipModule } from 'primeng/chip';
import { ImageModule } from 'primeng/image';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { TreeSelectModule } from 'primeng/treeselect';
import { ChartModule } from 'primeng/chart';
//Material
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';

//Form
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Swiper
import { SwiperModule } from 'swiper/angular';

//Components
import { SlideHomeComponent } from './components/slide-home/slide-home.component';
import { HomeComponent } from './components/home/home.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProductPopupComponent } from './components/product-popup/product-popup.component';
import { CartComponent } from './components/cart/cart.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { DetailProductComponent } from './components/detail-product/detail-product.component';
import { RelatedProductsComponent } from './components/related-products/related-products.component';
import { ViewedProductsComponent } from './components/viewed-products/viewed-products.component';
import { RecommendedProductsComponent } from './components/recommended-products/recommended-products.component';

import { AccountComponent } from './components/account-home/account/account.component';
import { AddressComponent } from './components/address/address.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

import { BillComponent } from './components/bill/bill.component';
import { CommentComponent } from './components/comment/comment.component';

//slider
import { NgxSliderModule } from '@angular-slider/ngx-slider';

//http
import { HttpClientModule } from '@angular/common/http';
import { AccountHomeComponent } from './components/account-home/account-home.component';
import { SearchFilterPipe } from './shared/search-filter.pipe';
import { DropdownDirective } from './directives/dropdown.directive';
import { HighlighterPipe } from './pipes/highlighter.pipe';
import { SearchComponent } from './components/search/search.component';

//admin
import { MainAdminComponent } from './components/admin/main-admin/main-admin.component';
import { HeaderAdminComponent } from './components/admin/header-admin/header-admin.component';
import { MenuBarComponent } from './components/admin/menu-bar/menu-bar.component';
import { ProductManagerComponent } from './components/admin/product-manager/product-manager.component';
import { UserManagerComponent } from './components/admin/user-manager/user-manager.component';
import { BillManagerComponent } from './components/admin/bill-manager/bill-manager.component';
import { VoucherManagerComponent } from './components/admin/voucher-manager/voucher-manager.component';
import { CommentManagerComponent } from './components/admin/comment-manager/comment-manager.component';
import { CategoryManagerComponent } from './components/admin/category-manager/category-manager.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { GroupProductComponent } from './components/admin/group-product/group-product.component';
import { HomeManagerComponent } from './components/admin/home-manager/home-manager.component';
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ItemProductComponent,
    ListProductComponent,
    ProductListHomeComponent,
    SlideHomeComponent,
    HomeComponent,
    FooterComponent,
    ProductPopupComponent,
    CartComponent,
    RegisterComponent,
    LoginComponent,
    DetailProductComponent,
    RelatedProductsComponent,
    ViewedProductsComponent,
    RecommendedProductsComponent,

    AccountComponent,
    AddressComponent,
    CheckoutComponent,
    BreadcrumbComponent,
    AccountHomeComponent,
    SearchFilterPipe,
    DropdownDirective,
    HighlighterPipe,
    SearchComponent,

    BillComponent,
    CommentComponent,
    ForgotPasswordComponent,

    //admin
    MainAdminComponent,
    HeaderAdminComponent,
    MenuBarComponent,
    ProductManagerComponent,
    UserManagerComponent,
    BillManagerComponent,
    VoucherManagerComponent,
    CommentManagerComponent,
    CategoryManagerComponent,
    GroupProductComponent,
    HomeManagerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    SwiperModule,
    LayoutModule,
    NgxSliderModule,

    //material
    MatIconModule,
    MatGridListModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatExpansionModule,
    MatDialogModule,
    MatTableModule,
    MatProgressBarModule,
    MatSliderModule,
    MatRadioModule,
    MatInputModule,
    MatSelectModule,

    //primeng
    PaginatorModule,
    DialogModule,
    ButtonModule,
    RatingModule,
    AvatarModule,
    AvatarGroupModule,
    TableModule,
    FileUploadModule,
    ToolbarModule,
    ToastModule,
    CardModule,
    InputTextModule,
    SkeletonModule,
    CKEditorModule,
    MultiSelectModule,
    CalendarModule,
    MessageModule,
    MessagesModule,
    ProgressSpinnerModule,
    ChipModule,
    ImageModule,
    ConfirmDialogModule,
    DropdownModule,
    TreeSelectModule,
    ChartModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
