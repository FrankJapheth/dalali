import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { RegistrationPageComponent } from './registration-page/registration-page.component';
import { SignInPageComponent } from './sign-in-page/sign-in-page.component';
import { MenuPageComponent } from './menu-page/menu-page.component';
import { SearchPageComponent } from './search-page/search-page.component';
import { PopularPageComponent } from './popular-page/popular-page.component';
import { CategoriesPageComponent } from './categories-page/categories-page.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { ProfilePageComponent } from './profile-page/profile-page.component';
import { CatPageComponent } from './cat-page/cat-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    RegistrationPageComponent,
    SignInPageComponent,
    MenuPageComponent,
    SearchPageComponent,
    PopularPageComponent,
    CategoriesPageComponent,
    ContactPageComponent,
    ProfilePageComponent,
    CatPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
