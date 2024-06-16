import { Component, Input, Output, EventEmitter , OnInit} from '@angular/core';
import { fileDisplay } from '../interfaces/fileTable/fileDisplay';
import { folderDisplay } from '../interfaces/fileTable/folderDisplay';
import { IconsService } from '../services/fileTable/icons.service';
import { OsDetectionService } from '../services/os-detection.service';

@Component({
  selector: 'app-file-table',
  templateUrl: './file-table.component.html',
  styleUrl: './file-table.component.css'
})
export class FileTableComponent implements OnInit {
  currentfolder!:number
  @Input() filesDisplay: fileDisplay[] = [];
  @Input() foldersDisplay: folderDisplay[] = [];
  icons = new IconsService()
  mobileview:boolean;
  desktopview:boolean

  constructor(private osService:OsDetectionService){
    this.filesDisplay = [        
      { id: 1, filename: 'File 1', filetype: 'folder', file_size: '1 MB', date_created: '2024-01-01', selected: false },
      { id: 2, filename: 'File 2', filetype: '.png', file_size: '2 MB', date_created: '2024-01-02', selected: false },
    ]
    this.desktopview = true
    this.mobileview = false
  }
  ngOnInit(): void {
    const os = this.osService.checkOs()
    if (os =="mobile"){
      this.mobileview = true
      this.desktopview = false       
    }else{
      this.desktopview = true
      this.mobileview = false      
    }
  }

}
