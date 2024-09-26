import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule, DatePipe } from '@angular/common';

interface AttendanceRecord {
  date: string;
  isPresent: boolean;
  formattedDate?: string; // Optional property for the formatted date
}

@Component({
  selector: 'app-student-attendance',
  standalone: true,
  templateUrl: './student-attendance.component.html',
  styleUrls: ['./student-attendance.component.css'],
  providers: [DatePipe], // Provide DatePipe here
  imports: [FormsModule,HttpClientModule, CommonModule]
})
export class StudentAttendanceComponent implements OnInit {
  subjects: any[] = [];
  selectedSubject: string = '';
  attendance: AttendanceRecord[] = []; // Use the interface here
  errorMessage: string = '';

  constructor(private http: HttpClient, private cookieService: CookieService, private datePipe: DatePipe) {} // Inject DatePipe

  ngOnInit() {
    this.fetchSubjects();
  }

  fetchSubjects() {
    const token = this.cookieService.get('accessToken');
    if (!token) {
      this.errorMessage = 'Token is missing';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any>('http://localhost:3000/student/subjectList', { headers }).subscribe(
      response => {
        if (response && response.data) {
          this.subjects = response.data;
        } else {
          this.errorMessage = 'Unexpected response structure';
        }
      },
      error => {
        this.errorMessage = 'Error fetching subjects';
      }
    );
  }

  fetchAttendance() {
    const token = this.cookieService.get('accessToken');
    if (!this.selectedSubject) {
      this.errorMessage = 'Please select a subject';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { subjectCode: this.selectedSubject };

    this.http.post<any>('http://localhost:3000/student/attendence', body, { headers }).subscribe(
      response => {
        if (response && response.data) {
          this.attendance = response.data.attendanceRecords.map((record: AttendanceRecord) => ({
            ...record,
            formattedDate: this.datePipe.transform(record.date, 'MMMM d, yyyy') // Format date
          }));
          this.errorMessage = '';
        } else {
          this.errorMessage = 'Unexpected response structure';
        }
      },
      error => {
        this.errorMessage = 'Error fetching attendance';
      }
    );
  }
}
