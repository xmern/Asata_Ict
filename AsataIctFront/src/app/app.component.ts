import { Component,HostListener,ViewChild, ElementRef } from '@angular/core';
import { UserDataService } from './services/userauth/user-data.service';
import { OnInit,OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from './interfaces/userauth/User';
import { Router } from '@angular/router';
import { HttpGatewayService } from './services/http-gateway.service';
import { folderCRequest } from './interfaces/fileTable/folderCRequest';
import { FileSystemService } from './services/fileTable/file-system.service';
import { fileDisplay } from './interfaces/fileTable/fileDisplay';
import { folderDisplay } from './interfaces/fileTable/folderDisplay';
import { OsDetectionService } from './services/os-detection.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy{
  title = 'AsataIctFront';
  os: string;
  mobileview:boolean;
  desktopview:boolean;
  showModal = false
  //userData = new UserDataService()
  currentUser: User | null = null;
  currentFolder: folderDisplay | null = null;
  userlogged = false  
  sidenavintwidth = '20%';
  sidenavWidth = '5%';
  mainpanelWidth = '5%';
  sidenavclosed = false
  private userSubscription!: Subscription;
  private folderSubscription!: Subscription;
  isFolderModalOpen = false;
  folderForm: FormGroup;
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFiles: File[] = [];
  uploadedFiles: File[] = [];
  uploading: boolean = false;
  progress: number = 0

  constructor(private osDetectionService: OsDetectionService,private userData:UserDataService, private router:Router,private fb: FormBuilder,private httpgateway:HttpGatewayService,private filesystem:FileSystemService){
    this.folderForm = this.fb.group({
      folderName: ['', Validators.required]
    });    
    this.os = 'windows'
    this.mobileview = false
    this.desktopview = true
    
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const screenWidth = event.target.innerWidth;
    this.checkScreenWidth(screenWidth);
  }

  ngOnInit(): void {
    if (!this.userlogged){
      this.router.navigate(['/login'])
    }

    this.checkScreenWidth(window.innerWidth);
    // this.os = this.osDetectionService.getOS();
    // this.performOsSpecificLogic();    
    // Subscribe to the user observable
    this.userSubscription = this.userData.getUserObservable().subscribe(
      (user: User | null) => {
        this.currentUser = user;
        //console.log('User changed:', user);
        if (this.currentUser?.jwt){
          this.userlogged = true;
        }
      },
      (error) => {
        console.error('Error occurred:', error);
      }
    );
    this.folderSubscription = this.filesystem.getfolderObservable().subscribe(
      (folder: folderDisplay | null) => {
        this.currentFolder = folder;
        console.log(this.currentFolder)
      },
      (error) => {
        console.error('Error occurred:', error);
      }
    );  
    if (window.innerWidth <   720){
      
      this.mobileview = true
      this.desktopview = false
    }

      // Manually set a user to check if subscription works
    //const testUser: User = { id: 2, email: 'test2@example.com', jwt: 'token2' };
    //this.userData.setUser(testUser);
  }
  ngOnDestroy():void{
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }   
    if (this.folderSubscription){
      this.folderSubscription.unsubscribe();
    }
  } 

  checkScreenWidth(width: number) {
    if (width < 768) { // Example breakpoint
      //this.sidenavWidth = '10%';
      //this.sidenavclosed = true
      this.closeSidenav();
    } else {
      //this.sidenavWidth = '10%';
      //this.sidenavclosed = false
      
      this.openSidenav()
    }
  }  
  closeSidenav() {
    // Your method to call when the width is less than the breakpoint
    //console.log('Screen width is less than 768px');
    let currentWidth = parseFloat(this.sidenavWidth);
    const targetWidth = 10; // Target width in percentage
    //console.log(currentWidth)
    if (currentWidth > 10){
      this.sidenavclosed = true
      for (let i = currentWidth; i > targetWidth; i--) {
        setTimeout(() => {
          this.sidenavWidth = i - 1 + '%';
        }, (currentWidth - i) * 10);
      }  
    }  
  }  
  // openSidenav() {
  //   // Your method to call when the width is less than the breakpoint
  //   //console.log('Screen width is less than 768px');
  //   let currentWidth = parseFloat(this.sidenavWidth);
  //   const targetWidth = 20; // Target width in percentage
  //   if (currentWidth < 20){
  //     for (let i = currentWidth; i < targetWidth; i++) {
  //       setTimeout(() => {
  //         this.sidenavWidth = i - 1 + '%';
  //       }, (currentWidth - i) * 10);
  //       if (currentWidth >= targetWidth){
  //         this.sidenavclosed = false 
  //       }
  //     }

         
      
  //   }
  // }
  performOsSpecificLogic(): void {
    if (this.osDetectionService.isDesktopOS(this.os)) {
      // Perform desktop-specific logic
      this.desktopview = true
      this.mobileview = false
      console.log('Running on a desktop OS:', this.os,this.mobileview);

    } else if (this.osDetectionService.isMobileOS(this.os)) {
      // Perform mobile-specific logic
      console.log('Running on a mobile OS:', this.os);
      this.desktopview = false
      this.mobileview = true
    } else {
      // Perform logic for unknown OS
      console.log('Running on an unknown OS:', this.os);
      this.desktopview = false
      this.mobileview = true
    }
  }  
  openSidenav() {
    let currentWidth = parseFloat(this.sidenavWidth);
    const targetWidth = 20; // Target width in percentage
  
    if (currentWidth < targetWidth) {
      for (let i = 1; i <= targetWidth - currentWidth; i++) {
        setTimeout(() => {
          this.sidenavWidth = (currentWidth + i) + '%';
          if (currentWidth + i >= targetWidth) {
            this.sidenavclosed = false;
          }
        }, i * 10); // Incremental delay for each step
      }
    }
  }  
  minimiseSidenav(){
    
    if (this.sidenavclosed){
      this.openSidenav()
    }
    else{
      this.closeSidenav()
    }
  }   
  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    
  }

  stopPropagation(event: Event): void {
    event.stopPropagation();
  } 
  
  //browsing
  openFiles(){
    this.router.navigate(['/myfiles'])
  }
  //
  openFolderModal() {
    this.isFolderModalOpen = true;
    this.openFiles()
    this.closeModal()
  }

  closeFolderModal() {
    this.isFolderModalOpen = false;
    this.folderForm = this.fb.group({
      folderName: ['', Validators.required]
    }); 
  }

  submitFolder() {
    if (this.folderForm.valid) {
      const folderName = this.folderForm.value.folderName;
      //alert("Folder Name: " + folderName);
      // Perform further actions such as making an API call or form submission

      const formData:folderCRequest = {userid:this.currentUser!.id,name:folderName,jwt:this.currentUser!.jwt,rootfolderid:this.currentFolder!.id}
      this.httpgateway.post<any>('files/foldercreation/', formData).subscribe(
        response => {
          console.log('successful', response);
          
        },
        error => {
          console.error('Login error', error.error);
          
        }
      );
      this.closeFolderModal()
    }

      
    else {
      alert("Please enter a folder name.");
    }
  }
  // files upload
  triggerFileInput() {
    this.fileInput.nativeElement.click();
    
    
  }

  onFileSelected(event: any) {
    this.selectedFiles = Array.from(event.target.files);
    if (this.selectedFiles.length > 0) {
      //console.log(this.selectedFiles)
      this.closeFolderModal()
      this.uploading = true;
      this.uploadFiles();
      
    }
  }  
  uploadFiles() {
    const totalFiles = this.selectedFiles.length;
    if (this.mobileview || this.desktopview){
        this.selectedFiles.forEach(file => {
          const formData = new FormData();
          formData.append('file', file, file.name);
          formData.append('userid', this.currentUser!.id.toString());
          formData.append('folderid', this.currentFolder!.id.toString());
          formData.append('filename', file.name);
          // Splitting file name and extracting file type
          const fileNameParts = file.name.split('.');
          const fileType = fileNameParts.length > 1 ? fileNameParts[fileNameParts.length - 1] : '';
          formData.append('filetype', "."+fileType);
          formData.append('jwt',this.currentUser!.jwt)     
          this.httpgateway.upload('files/fileupload/', formData)
          .subscribe(response => {
            this.uploadedFiles.push(file);
            this.selectedFiles = this.selectedFiles.filter(f => f !== file);
            this.updateProgress(totalFiles);
            if (this.selectedFiles.length == 0) {
             this.uploading = false;
           }
        }, error => {
          console.error('Upload failed!', error);
        });
      });
    }
  }  
  uploadFileInChunks(file: File) {
    const chunkSize = 1024 * 1024; // 1MB chunks
    const totalChunks = Math.ceil(file.size / chunkSize);
    // Initial request to create the file and get the file ID
    const initialFormData = new FormData();
    initialFormData.append('filename', file.name);
    initialFormData.append('filetype', file.type);
    initialFormData.append('userid', this.currentUser!.id.toString());
    initialFormData.append('folderid', this.currentFolder!.id.toString());
    this.httpgateway.upload('files/mobilefileupload/', initialFormData).subscribe((response: any) => {
      const fileId = response.file_id;
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(start + chunkSize, file.size);
        const chunk = file.slice(start, end);
      
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('file_id', fileId);
        formData.append('userid', this.currentUser!.id.toString());
        formData.append('folderid', this.currentFolder!.id.toString());
        formData.append('filename', file.name);
        // Splitting file name and extracting file type
        const fileNameParts = file.name.split('.');
        const fileType = fileNameParts.length > 1 ? fileNameParts[fileNameParts.length - 1] : '';
        formData.append('filetype', "."+fileType);
        formData.append('jwt',this.currentUser!.jwt)      
        formData.append('chunk', chunk);
        formData.append('chunkIndex', i.toString());
        formData.append('totalChunks', totalChunks.toString());

        this.httpgateway.upload('files/mobilefileupload/', formData,).subscribe(
          response => console.log('Chunk upload success', response),
          error => console.log(error)
        );
    }
  },error => console.error('Initial file creation error', error));
  }
  updateProgress(totalFiles: number) {
    const uploadedFilesCount = this.uploadedFiles.length;
    this.progress = (uploadedFilesCount / totalFiles) * 100;
  }  
}
