import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // Import HttpClient
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './admin-register.component.html',
  styleUrls: ['./admin-register.component.css']
})
export class AdminRegisterComponent {

  registrationSuccess = false;
  registrationFailed = false;

  constructor(private router: Router, private http: HttpClient) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.http.post('http://localhost:3000/admin/register', form.value)
        .pipe(
          catchError(error => {
            console.error('Registration failed', error);
            this.registrationFailed = true;
            return of(null);
          })
        )
        .subscribe(response => {
          if (response) {
            console.log('Registration successful:', response);
            this.registrationSuccess = true;
            setTimeout(() => {
              this.router.navigate(['/']);
            }, 2000);
          } else {
            this.registrationFailed = true;
          }
        });
    }
  }
}
