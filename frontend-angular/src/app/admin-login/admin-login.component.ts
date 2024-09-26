import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  loginError = false;

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.http.post('http://localhost:3000/admin/login', form.value).subscribe(
        (response: any) => {
          if (response.success) {
            // Extract and log the access token
            const accessToken = response.data.accessToken;
            console.log('Access Token:', accessToken);
            this.cookieService.set('accessToken', accessToken);
            this.router.navigate(['/admin-dashboard']);
          } else {
            this.loginError = true;
          }
        },
        (error) => {
          console.error('Login error:', error);
          this.loginError = true;
        }
      );
    }
  }
}
