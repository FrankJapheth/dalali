import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { MenuPageComponent } from './menu-page/menu-page.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';


const routes: Routes = [
  {path:'' , component: HomePageComponent},
  {path:'home' , component: HomePageComponent},
  {path:'menu' , component: MenuPageComponent},
  {path:'signUp' , component: RegistrationPageComponent},
  {path:'signIn' , component: SignInPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
