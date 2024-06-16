import { Component, OnInit , ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FileSystemService } from '../services/fileTable/file-system.service';
import { HttpGatewayService } from '../services/http-gateway.service';
import { UserDataService } from '../services/userauth/user-data.service';
import { Observable, Subscription,interval } from 'rxjs';
import { User } from '../interfaces/userauth/User';
import { folderDisplay } from '../interfaces/fileTable/folderDisplay';
import { fileTable } from '../interfaces/fileTable/fileTable';


@Component({
  selector: 'app-myfiles',
  templateUrl: './myfiles.component.html',
  styleUrl: './myfiles.component.css'
})
export class MyfilesComponent implements OnInit {
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  data!: fileTable;
  pageSize: number = 20; // Initial page size
  loading: boolean = false;
  intervalId:any;
  sub:any;

  currentUser: User | null = null;
  currentFolder: folderDisplay | null = null; 
  private userSubscription!: Subscription;
  private folderSubscription!: Subscription;   
  constructor(private userData:UserDataService,private httpgateway:HttpGatewayService,private filesystem:FileSystemService){

  }
  ngOnInit(): void {
    // Subscribe to the user observable
    this.userSubscription = this.userData.getUserObservable().subscribe(
      (user: User | null) => {
        this.currentUser = user;
        //console.log('User changed:', user);

      },
      (error) => {
        console.error('Error occurred:', error);
      }
    );
    this.folderSubscription = this.filesystem.getfolderObservable().subscribe(
      (folder: folderDisplay | null) => {
        this.currentFolder = folder;
      },
      (error) => {
        console.error('Error occurred:', error);
      }
    );    
    

    this.httpgateway.get<folderDisplay>('files/filesview/1/'+this.currentUser?.id+'/'+0+'/'+0).subscribe(
      response => {
        const folder:folderDisplay = response
        this.filesystem.setfolder(folder)
        this.loadData()
      },
      error => {
        console.error('', error.error);
        
      }
    );
    this.startPeriodicTask()
    
  }
  ngOnDestroy(): void {
    this.clearPeriodicTask();
  }  
  startPeriodicTask() {
    this.sub = interval(5000)
    .subscribe((val) => { this.loadData()}); // 5000 milliseconds = 5 seconds
  }
  clearPeriodicTask() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }  
  // ngAfterViewInit() {
  //   this.loadData();
  //   this.scrollContainer.nativeElement.addEventListener('scroll', this.onScroll.bind(this));
  // }
  // onScroll(): void {
  //   const element = this.scrollContainer.nativeElement;
  //   if ((element.scrollTop + element.clientHeight >= element.scrollHeight) && !this.loading) {
  //     this.loadData();
  //   }
  // }

  loadData() {
    this.loading = true;
    this.httpgateway.get<fileTable>('files/filesview/0/'+this.currentUser?.id+'/'+this.currentFolder!.id+'/'+this.pageSize).subscribe(
      response => {
        this.data = response;
        this.pageSize += 20; // Increase page size for the next request
        this.loading = false;
      },
      error => {
        console.error('Error fetching data', error);
        this.loading = false;
      }
    );
  } 

}


