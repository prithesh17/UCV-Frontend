import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.component.css']
})
export class StudentDashboardComponent {
  
}
