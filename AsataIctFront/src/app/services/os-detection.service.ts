import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OsDetectionService {

  private mobileOS: string[] = ['Android', 'iOS'];
  private desktopOS: string[] = ['Windows', 'MacOS', 'Linux','Tecno'];

  constructor() { }
  checkOs():string{
    if (window.innerWidth <   720){
      return "mobile"      
    }
    return "pc"
  }
  getOS(): string {
    const userAgent = window.navigator.userAgent;

    if (/Windows NT/i.test(userAgent)) {
      return 'Windows';
    } else if (/Mac/i.test(userAgent)) {
      return 'MacOS';
    } else if (/Linux/i.test(userAgent)) {
      return 'Linux';
    } else if (/Android/i.test(userAgent)) {
      return 'Android';
    } else if (/iPhone|iPad|iPod/i.test(userAgent)) {
      return 'iOS';
    } else if (/Tecno/i.test(userAgent)) {
        return 'android';      
    } else {
      return 'Unknown';
    }
  }

  isMobileOS(os: string): boolean {
    return this.mobileOS.includes(os);
  }

  isDesktopOS(os: string): boolean {
    return this.desktopOS.includes(os);
  }
}

