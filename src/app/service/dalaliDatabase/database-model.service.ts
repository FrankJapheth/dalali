import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatabaseModelService {

  public databaseName:string = 'dalali';
  public cartStore:Cart = {};

  constructor() { }

}
