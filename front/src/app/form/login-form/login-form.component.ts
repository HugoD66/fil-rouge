import type { WritableSignal} from '@angular/core';
import {Component, signal} from '@angular/core';
import type { FormGroup} from '@angular/forms';
import {FormControl, ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss'
})
export class LoginFormComponent {
    // public loginForm: WritableSignal<FormGroup>;

    public email: WritableSignal<string | undefined> = signal<string | undefined>(undefined);
    public password: WritableSignal<string | undefined> = signal<string | undefined>(undefined);
}
