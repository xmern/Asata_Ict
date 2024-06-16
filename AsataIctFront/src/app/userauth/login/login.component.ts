import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpGatewayService } from '../../services/http-gateway.service';
import { HttpClient } from '@angular/common/http';
import { UserDataService } from '../../services/userauth/user-data.service';
import { loginRequest } from '../../interfaces/userauth/loginRequest';
import { loginResponse } from '../../interfaces/userauth/loginResponse';
import { User } from '../../interfaces/userauth/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage!:string;
  showModal: boolean = false;  
  user!:User;

  constructor(private fb: FormBuilder, private router: Router, private httpGateway:HttpGatewayService, private userdata:UserDataService ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
    this.user = {id:0,email:"",jwt:""};
    this.errorMessage = "request failed server might be down"
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData:loginRequest = this.loginForm.value;
      this.httpGateway.post<loginResponse>('login/', loginData).subscribe(
        response => {
          this.user.id = response.id;
          this.user.email = response.email;
          this.user.jwt = response.jwt
                    
          this.userdata.setUser(this.user)
          //console.log('Login successful', response);
          // Navigate to dashboard or other page on successful login
          this.router.navigate(['/home']);
        },
        error => {
          console.error('Login error', error.error);
          this.errorMessage = error.error.detail
          if (!this.errorMessage){
            this.errorMessage = "request failed server might be down"
          }
          this.openModal()
          
        }
      );
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

}
