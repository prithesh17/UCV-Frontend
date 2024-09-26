import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule,FormsModule,HttpClientModule],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.css'
})
export class AttendanceComponent implements OnInit {
  students: any[] = [];
  selectedStudent: any = null;
  date: string = '';
  isPresent: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';


  constructor(private http: HttpClient, private cookieService: CookieService) {}

  ngOnInit() {
    this.fetchStudents();
  }

  fetchStudents() {
    const token = this.cookieService.get('accessToken');
    console.log('Token from cookie:', token); // Debugging line to ensure token is retrieved
  
    if (!token) {
      console.error('Token is missing');
      return;
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any>('http://localhost:3000/subject/studentList', { headers }).subscribe(
      response => {
        if (response && response.data) {
          this.students = response.data;
          console.log('Students fetched successfully', this.students); // Debugging line to ensure students are fetched
        } else {
          console.error('Unexpected response structure', response);
        }
      },
      error => {
        console.error('Error fetching student list', error); // Debugging line for error handling
      }
    );
  }

  onSubmit() {
    const attendanceData = {
      studentId: this.selectedStudent?._id, 
      date: this.date,
      isPresent: this.isPresent
    };
  
    console.log('Form Data:', attendanceData);  
  
    const token = this.cookieService.get('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    this.http.post('http://localhost:3000/subject/updateAttendence', attendanceData, { headers }).subscribe(
      response => {
        console.log('Attendance updated successfully', response);
        this.successMessage = 'Attendance updated successfully';
        this.errorMessage = '';
    },
      error => {
        console.error('Error updating attendance', error);
        this.errorMessage = 'Error updating attendance';
        this.successMessage = '';
      }
    );
  }
  
}