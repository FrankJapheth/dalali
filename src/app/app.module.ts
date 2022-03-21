import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';
import { MenuPageComponent } from './menu-page/menu-page.component';
import { PopularPageComponent } from './popular-page/popular-page.component'
import { ContactPageComponent } from './contact-page/contact-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { BunnerComponent } from './bunner/bunner.component';
import { HomeCategoriesComponent } from './home-categories/home-categories.component';
import { SuperUserComponent } from './super-user/super-user.component';
import { AdminComponent } from './admin/admin.component';
import { AgelimiterComponent } from './agelimiter/agelimiter.component';
import { LoaderComponent } from './loader/loader.component';
import { UserSearchComponent } from './user-search/user-search.component';
import { SystemMaintananceComponent } from './system-maintanance/system-maintanance.component';
import { UpdatingSiteComponent } from './updating-site/updating-site.component';
import { ErrorCorectionComponent } from './error-corection/error-corection.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { RetailerManagementComponent } from './retailer-management/retailer-management.component';
import { ProductSearchComponent } from './product-search/product-search.component';
import { RetailerToolsComponent } from './retailer-tools/retailer-tools.component';
import { AddProductsComponent } from './add-products/add-products.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { ProductPelleteComponent } from './product-pellete/product-pellete.component';
import { ProductsComponent } from './products/products.component';
import { CartComponent } from './cart/cart.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { PrivaceyPoliceyComponent } from './privacey-policey/privacey-policey.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { AboutDalaliComponent } from './about-dalali/about-dalali.component';
import { ProductsCategoriesComponent } from './products-categories/products-categories.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    RegistrationPageComponent,
    SignInPageComponent,
    MenuPageComponent,
    PopularPageComponent,    
    ContactPageComponent,
    ProfilePageComponent,
    BunnerComponent,
    HomeCategoriesComponent,
    SuperUserComponent,
    AdminComponent,
    AgelimiterComponent,
    LoaderComponent,
    UserSearchComponent,
    SystemMaintananceComponent,
    UpdatingSiteComponent,
    ErrorCorectionComponent,
    ProductManagementComponent,
    RetailerManagementComponent,
    ProductSearchComponent,
    RetailerToolsComponent,
    AddProductsComponent,
    SearchResultComponent,
    ProductPelleteComponent,
    ProductsComponent,
    CartComponent,
    CheckOutComponent,
    PrivaceyPoliceyComponent,
    TermsOfServiceComponent,
    AboutDalaliComponent,
    ProductsCategoriesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
