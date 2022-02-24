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


const routes: Routes = [
  {
    path:'' , 
    component: LoaderComponent
  },
  {
    path:'home' , 
    component: HomePageComponent
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
    path:'categories' , 
    component: CategoriesPageComponent
  },
  {
    path:'contact' , 
    component: ContactPageComponent
  },
  {
    path:'popular' , 
    component: PopularPageComponent
  },
  {
    path:'search' , 
    component: SearchPageComponent
  },
  {
    path:'cat' , 
    component: CatPageComponent
  },
  {
    path:'userprofile' , 
    component: ProfilePageComponent
  },
  {
    path:'superuser' , 
    component: SuperUserComponent
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

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  public exportedRoutes:Array<Object>=routes
}
