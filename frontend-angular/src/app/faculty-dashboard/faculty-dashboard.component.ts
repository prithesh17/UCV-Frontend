import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-faculty-dashboard',
  standalone: true,
  imports: [RouterOutlet,RouterLink],
  templateUrl: './faculty-dashboard.component.html',
  styleUrl: './faculty-dashboard.component.css'
})
export class FacultyDashboardComponent {

}
