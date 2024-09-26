import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-faculty-login',
  standalone: true,
  templateUrl: './faculty-login.component.html',
  imports: [FormsModule, CommonModule, HttpClientModule],
  styleUrls: ['./faculty-login.component.css'],
  providers: [CookieService]
})
export class FacultyLoginComponent {
  loginError = false;

  constructor(private http: HttpClient, private router: Router, private cookieService: CookieService) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.http.post('http://localhost:3000/subject/login', form.value).subscribe(
        (response: any) => {
          if (response.success) {
            const accessToken = response.data.accessToken;
            console.log(accessToken);
            this.cookieService.set('accessToken', accessToken);
            this.router.navigate(['/faculty-dashboard']);
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
