import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'front';

  protected async testApi(): Promise<void> {
    try {
      const response: Response = await fetch('http://localhost:3000/');
      const text = await response.text();
      console.log('API Response:', text);
    } catch (error) {
      console.error('Error fetching API:', error);
    }
  }
}
