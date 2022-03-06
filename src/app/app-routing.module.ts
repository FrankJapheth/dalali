import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';
import { CategoriesPageComponent } from './categories-page/categories-page.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { PopularPageComponent } from './popular-page/popular-page.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { CatPageComponent } from './cat-page/cat-page.component';
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

const routes: Routes = [
  {
    path:'' , 
    component: LoaderComponent
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
    path:'cat' , 
    component: CatPageComponent,
  },
  {
    path:'categories' , 
    component: CategoriesPageComponent
  },
  {
    path:'contact' , 
    component: ContactPageComponent
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
    path:'popular' , 
    component: PopularPageComponent
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
    component: SearchPageComponent
  },
  {
    path:'userprofile' , 
    component: ProfilePageComponent
  },
  {
    path:'updating' , 
    component: UpdatingSiteComponent
  },
  /* {
    path:'userhome', 
    component:HomePageComponent,
    children:[
      {
        path:''
      }
    ]
  } */
];

// class routingConf {
//   constructor(
//     private dalaliData:any,
//   ) {}
//   getRoutedLinks():void{
//     this.dalaliData.getRoutedLinks().then((resp:any)=>{
//       let typeOfRedirect:any=resp.typeOfRedirect
//       let redirectedLinks:any=resp.redirectLinks
//       let appRouterLinks:any=routes
//       for (let index = 0; index < appRouterLinks.length; index++) {
//         const appRouter:any = appRouterLinks[index]; 
//         let routerpath:any=appRouter.path
//         for (let index = 0; index < redirectedLinks.length; index++) {
//           const routedLink = redirectedLinks[index];
//           if(routerpath!="" && routerpath==routedLink){
//             for (let index = 0; index < this.dalaliData.systemRepairTypes.length; index++) {
//               const errorType = this.dalaliData.systemRepairTypes[index];
//               if(typeOfRedirect==errorType){
//                 appRouter.component=null
//                 appRouter.redirectTo=`/${errorType}`
//               }              
//             }       
//           }
//         }
//       } 
//     })
//   }
// }
// let routerConf:any=new routingConf(DalalidataService)
// routerConf.getRoutedLinks()

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  public exportedRoutes:Array<Object>=routes

}
