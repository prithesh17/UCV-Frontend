import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-marks',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './marks.component.html',
  styleUrls: ['./marks.component.css']
})
export class MarksComponent implements OnInit {
  students: any[] = [];
  selectedStudent: any = null;
  examType: string = '';
  maxMarks: number = 20;
  scoredMarks: number = 0;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  ngOnInit() {
    this.fetchStudents();
  }

  fetchStudents() {
    const token = this.cookieService.get('accessToken');
    console.log('Token from cookie:', token);

    if (!token) {
      console.error('Token is missing');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any>('http://localhost:3000/subject/studentList', { headers }).subscribe(
      response => {
        if (response && response.data) {
          this.students = response.data;
          console.log('Students fetched successfully', this.students);
        } else {
          console.error('Unexpected response structure', response);
        }
      },
      error => {
        console.error('Error fetching student list', error);
      }
    );
  }

  onSubmit() {

    // Validate scored marks
    if (this.scoredMarks < 0 || this.scoredMarks > this.maxMarks) {
      this.errorMessage = `Scored marks must be between 0 and ${this.maxMarks}`;
      this.successMessage = '';
      return;
    }

    const marksData = {
      studentId: this.selectedStudent?._id,
      testType: this.examType,
      maxMarks: this.maxMarks,
      scoredMarks: this.scoredMarks
    };

    console.log('Form Data:', marksData);

    const token = this.cookieService.get('accessToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post('http://localhost:3000/subject/updateMarks', marksData, { headers }).subscribe(
      response => {
        console.log('Marks updated successfully', response);
        this.successMessage = 'Marks updated successfully';
        this.errorMessage = '';
      },
      error => {
        console.error('Error updating marks', error);
        this.errorMessage = 'Error updating marks';
        this.successMessage = '';
      }
    );
  }
}
