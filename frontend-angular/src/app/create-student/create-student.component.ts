import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-create-student',
  standalone: true,
  templateUrl: './create-student.component.html',
  imports: [FormsModule, CommonModule, HttpClientModule],
  styleUrls: ['./create-student.component.css'],
  providers: [CookieService]
})

export class CreateStudentComponent {
  creationSuccess = false;
  creationError = false;
  errorMessage = '';

  constructor(private router: Router, private http: HttpClient, private cookieService: CookieService) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      console.log('Form Data:', form.value);

      // Read the token from the cookies
      const token = this.cookieService.get('accessToken');
      console.log('Token from cookie:', token);

      // Set headers
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

      // Send the data to the backend
      this.http.post('http://localhost:3000/admin/createStudent', form.value, { headers }).subscribe(
        (response: any) => {
          console.log('Response:', response);
          if (response.success) {
            this.creationSuccess = true;
            setTimeout(() => {
              this.creationSuccess = false;
              this.router.navigate(['admin-dashboard']);
            }, 2000);
          } else {
            this.creationError = true;
            this.errorMessage = response.msg || 'Failed to create student';
          }
        },
        (error) => {
          console.error('Error:', error);
          this.creationError = true;
          this.errorMessage = error.error.msg || 'An error occurred';
        }
      );
    }
  }
}
