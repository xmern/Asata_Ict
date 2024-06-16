import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { folderDisplay } from '../../interfaces/fileTable/folderDisplay';
@Injectable({
  providedIn: 'root'
})
export class FileSystemService {

  private folderSubject: BehaviorSubject<folderDisplay| null>;
  public folder: Observable<folderDisplay | null>;
  constructor() {
    // Initialize the folder subject with null or a default value
    this.folderSubject = new BehaviorSubject<folderDisplay | null>(null);
    this.folder = this.folderSubject.asObservable();  
   }
   public get currentfolderValue(): folderDisplay | null {
    return this.folderSubject.value;
  }   
  setfolder(data:folderDisplay){
    // Set the folder and notify all subscribers
    this.folderSubject.next(data); 
    //console.log(this.folderSubject.value?.jwt)
  }
  isfolder(): boolean {
    return !!this.folderSubject.value;
  } 
  getfolder(): folderDisplay | null {
    return this.currentfolderValue;
  }    
   getfolderObservable(): Observable<folderDisplay | null> {
    return this.folder;
  }   
}
