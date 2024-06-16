import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../interfaces/userauth/User';
import { permissions } from '../../interfaces/userauth/permissionResponse';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;
  userPermissions!:permissions

  constructor() {
    // Initialize the user subject with null or a default value
    this.userSubject = new BehaviorSubject<User | null>(null);
    this.user = this.userSubject.asObservable();    
  }
  public get currentUserValue(): User | null {
    return this.userSubject.value;
  }  
  //isLogged():boolean{
    //if (this.userSubject.value && this.userSubject.value.jwt != null){
    //  return true
    //}
   // return false
  //}
  setUser(data:User){
    // Set the user and notify all subscribers
    this.userSubject.next(data); 
    console.log(this.userSubject.value?.jwt)

  }
  isLogged(): boolean {
    return !!this.userSubject.value;
  } 
  getUser(): User | null {
    return this.currentUserValue;
  } 
  getUserObservable(): Observable<User | null> {
    return this.user;
  }
  
}
