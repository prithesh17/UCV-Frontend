import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-student-marks',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './student-marks.component.html',
  styleUrl: './student-marks.component.css'
})

export class StudentMarksComponent implements OnInit {
  subjects: any[] = [];
  selectedSubject: string = '';
  marks: any[] = [];
  errorMessage: string = '';

  constructor(private http: HttpClient, private cookieService: CookieService) {}

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

  fetchMarks() {
    const token = this.cookieService.get('accessToken');
    if (!token) {
      this.errorMessage = 'Token is missing';
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = { subjectCode: this.selectedSubject };
    this.http.post<any>('http://localhost:3000/student/marks', body, { headers }).subscribe(
      response => {
        if (response && response.data && response.data.marksRecords) {
          this.marks = response.data.marksRecords.map((record: any) => ({
            examType: record.testType,
            maxMarks: record.maxMarks,
            scoredMarks: record.scoredMarks
          }));
        } else {
          this.errorMessage = 'Unexpected response structure';
        }
      },
      error => {
        this.errorMessage = 'Error fetching marks';
      }
    );
  }
}
