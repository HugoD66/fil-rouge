import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {NgClass} from "@angular/common";
import {RegisterDto} from "@fil-rouge/front/app/api";

type RegisterFormModel = {
  firstName: FormControl<RegisterDto['firstName']>;
  lastName: FormControl<RegisterDto['lastName']>;
  email: FormControl<RegisterDto['email']>;
  password: FormControl<RegisterDto['password']>;
};

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent {
  // === Validators calqués sur le RegisterDto (class-validator) ===
  public firstName = new FormControl<string>('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
    ],
  });

  public lastName = new FormControl<string>('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
    ],
  });

  public email = new FormControl<string>('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.email,
      Validators.minLength(2),
      Validators.maxLength(50),
    ],
  });

  public password = new FormControl<string>('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(2),
      Validators.maxLength(50),
    ],
  });

  public registerForm = new FormGroup<RegisterFormModel>({
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    password: this.password,
  });

  // Helpers: état d’erreur + classes Tailwind conditionnelles
  protected isInvalid<K extends keyof RegisterFormModel>(controlName: K): boolean {
    const c = this.registerForm.get(controlName as string);
    return !!c && c.invalid && (c.dirty || c.touched);
  }

  protected inputClasses<K extends keyof RegisterFormModel>(controlName: K): string {
    const base = 'w-full p-2 border rounded outline-none transition';
    return this.isInvalid(controlName)
      ? `${base} border-red-500 ring-1 ring-red-500`
      : `${base} border-gray-300 focus:ring-1 focus:ring-blue-500 focus:border-blue-500`;
  }

  // Map lisible des messages d'erreurs
  protected errorMessage(control: FormControl): string | null {
    if (!control?.errors) return null;

    if (control.errors['required'])   return 'Ce champ est requis.';
    if (control.errors['email'])      return 'Veuillez saisir un email valide.';
    if (control.errors['minlength'])  return `Minimum ${control.errors['minlength'].requiredLength} caractères.`;
    if (control.errors['maxlength'])  return `Maximum ${control.errors['maxlength'].requiredLength} caractères.`;

    return 'Valeur invalide.';
  }

  // Soumission
  protected async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
    const payload = this.registerForm.getRawValue();
    console.log('Register payload:', payload);

    try {
      // Simuler la conversion en RegisterDto (ici c'est déjà le cas grâce aux types)
      const registerDto: RegisterDto = {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        password: payload.password,
      };
      console.log('RegisterDto ready to be sent:', registerDto);
      const response = await fetch('http://localhost:3000/security/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerDto),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Registration successful:', data);
    } catch (error) {
      console.error('Error during registration:', error);
    }
    // 👉 Ici tu peux appeler ton endpoint Nest qui attend RegisterDto
    // this.authService.register(payload).subscribe(...)
  }
}
