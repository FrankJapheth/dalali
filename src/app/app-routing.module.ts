import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { PopularPageComponent } from './popular-page/popular-page.component';
import { CartComponent } from './cart/cart.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { LoaderComponent } from './loader/loader.component';
import { SuperUserComponent } from './super-user/super-user.component';
import { UpdatingSiteComponent } from './updating-site/updating-site.component';
import { ErrorCorectionComponent } from './error-corection/error-corection.component';
import { AdminComponent } from './admin/admin.component';
import { ProductManagementComponent } from './product-management/product-management.component';
import { RetailerManagementComponent } from './retailer-management/retailer-management.component';
import { RetailerToolsComponent } from './retailer-tools/retailer-tools.component';
import { AddProductsComponent } from './add-products/add-products.component';
import { ProductSearchComponent } from './product-search/product-search.component';
import { SearchResultComponent } from './search-result/search-result.component';
import { ProductsComponent } from './products/products.component';
import { PrivaceyPoliceyComponent } from './privacey-policey/privacey-policey.component';
import { TermsOfServiceComponent } from './terms-of-service/terms-of-service.component';
import { AboutDalaliComponent } from './about-dalali/about-dalali.component';
import { ProductsCategoriesComponent } from './products-categories/products-categories.component';
import { CustomersOrdersComponent } from './customers-orders/customers-orders.component';
import { ProductsAddedComponent } from './products-added/products-added.component';
import { ProductsOrderedComponent } from './products-ordered/products-ordered.component';
import { ProductsSoldComponent } from './products-sold/products-sold.component';
import { InventoryComponent } from './inventory/inventory.component';
import { DaysChangesComponent } from './days-changes/days-changes.component';
import { DalaliCalenderComponent } from './dalali-calender/dalali-calender.component';
import { DaysProductSoldComponent } from './days-product-sold/days-product-sold.component';
import { UserToolComponent } from './user-tool/user-tool.component';
import { UserOdersComponent } from './user-oders/user-oders.component';
import { OrderDetailsComponent } from './order-details/order-details.component';

const routes: Routes = [
  {
    path:'' , 
    component: HomePageComponent
  },
  {
    path:'aboutUs',
    component:AboutDalaliComponent
  },
  {
    path:'addProducts',
    component:AddProductsComponent
  },
  {
    path:'admin',
    component:AdminComponent
  },
  {
    path:'cart' , 
    component: CartComponent,
  },
  {
    path:'categories' , 
    component: ProductsCategoriesComponent
  },
  {
    path:'contact' , 
    component: ContactPageComponent
  },
  {
    path:'customerOrders' , 
    component: CustomersOrdersComponent
  },
  {
    path:'dalaliCalender' , 
    component: DalaliCalenderComponent,
  },
  {
    path:'daysChanges',
    component:DaysChangesComponent
  },
  {
    path:'daysProductSold',
    component:DaysProductSoldComponent
  },
  {
    path:'errorCorrection' ,
    component: ErrorCorectionComponent
  },
  {
    path:'home' , 
    component: HomePageComponent
  },
  {
    path:'orderDetails' , 
    component: OrderDetailsComponent
  },
  {
    path:'popular' , 
    component: PopularPageComponent
  },
  {
    path:'privaceyPolicy' , 
    component: PrivaceyPoliceyComponent
  },
  {
    path:'products' , 
    component: ProductsComponent
  },
  {
    path:'productsAdded' , 
    component: ProductsAddedComponent
  },
  {
    path:'productsOrdered' , 
    component: ProductsOrderedComponent
  },
  {
    path:'productsSold' , 
    component: ProductsSoldComponent
  },
  {
    path:'productManagement' , 
    component: ProductManagementComponent
  },
  {
    path:'retailerManagement' , 
    component: RetailerManagementComponent
  },
  {
    path:'retailerTools' , 
    component: RetailerToolsComponent
  },
  {
    path:'signUp' , 
    component: RegistrationPageComponent
  },
  {
    path:'signIn' , 
    component: SignInPageComponent
  },
  {
    path:'superuser' , 
    component: SuperUserComponent
  },
  {
    path:'search' , 
    component: ProductSearchComponent
  },
  {
    path:'searchResult' , 
    component: SearchResultComponent
  },
  {
    path:'stockManagement' , 
    component: InventoryComponent
  },
  {
    path:'termsOfService' , 
    component: TermsOfServiceComponent
  },
  {
    path:'updating' , 
    component: UpdatingSiteComponent
  },
  {
    path:'userprofile' , 
    component: ProfilePageComponent
  },
  {
    path:'userOrders',
    component:UserOdersComponent
  },
  {
    path:'userTools' , 
    component: UserToolComponent
  },
  { 
    path: '**', 
    component: LoaderComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  public exportedRoutes:Array<Object>=routes

}
