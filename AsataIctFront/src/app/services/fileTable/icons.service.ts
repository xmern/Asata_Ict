import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IconsService {
  iconsdict:any;

  constructor() { 
    this.iconsdict={
      '.png':'assets/icons/fileicons/png.png',
      '.jpg':'assets/icons/fileicons/jpg.png',
      '.file':'assets/icons/fileicons/file.png',
      '.after-effects':'assets/icons/fileicons/after-effects.png',
      '.ai':'assets/icons/fileicons/ai.png',
      '.audition':'assets/icons/fileicons/audition.png',
      '.avi':'assets/icons/fileicons/avi.png',
      '.bridge':'assets/icons/fileicons/bridge.png',
      '.css':'assets/icons/fileicons/css.png',
      '.csv':'assets/icons/fileicons/csv.png',
      '.dbf':'assets/icons/fileicons/dbf.png',
      '.doc':'assets/icons/fileicons/doc.png',
      '.dwg':'assets/icons/fileicons/dwg.png',
      '.fireworks':'assets/icons/fileicons/fireworks.png',
      '.fla':'assets/icons/fileicons/fla.png',
      '.flash':'assets/icons/fileicons/flash.png',
      '.html':'assets/icons/fileicons/html.png',
      '.illustrator':'assets/icons/fileicons/illustrator.png',
      '.iso':'assets/icons/fileicons/iso.png',
      '.js':'assets/icons/fileicons/javascript.png',
      '.json':'assets/icons/fileicons/json-file.png',
      '.mp3':'assets/icons/fileicons/mp3.png',
      '.mp4':'assets/icons/fileicons/mp4.png',
      '.pdf':'assets/icons/fileicons/pdf.png',
      '.psd':'assets/icons/fileicons/photoshop.png',
      '.ppt':'assets/icons/fileicons/ppt.png',
      '.plproj':'assets/icons/fileicons/prelude.png',
      '.txt':'assets/icons/fileicons/txt.png',
      '.exe':'assets/icons/fileicons/exe.png',
      '.zip':'assets/icons/fileicons/zip.png',
      '.py':'assets/icons/fileicons/py.png',
      '.pptx':'assets/icons/fileicons/pptx.png',
      '.msi':'assets/icons/fileicons/msi.png',
      'folder':'assets/icons/open-folder.png'
    }
  }
  getIcon(icon:string){
    
    try{
      let icon_:string;
      icon_ = this.iconsdict[icon]
      if (!icon_){
        icon_ = this.iconsdict['.file']
      } 
      return icon_
    }
    catch(error){
      let icon_:string;
      icon_ = this.iconsdict['.file']
      return icon_

    }
  }
}
