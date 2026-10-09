import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TranslatePipe} from '@ngx-translate/core';
import {BaseForm} from '../../../../shared/presentation/components/base-form/base-form';
import {WorkspaceEnvironment, workspaceEnvironments} from '../../../../shared/presentation/workspace-environments';
import {IamStore} from '../../../application/iam.store';
import {SignInCommand} from '../../../domain/model/sign-in.command';
import {EnvironmentIcon} from '../../components/environment-icon/environment-icon';

/**
 * Sign-in to one environment: credentials, two-factor code and the "not authorized" state.
 */
@Component({
  selector: 'app-sign-in-form',
  imports: [ReactiveFormsModule, RouterLink, TranslatePipe, EnvironmentIcon],
  templateUrl: './sign-in-form.html',
  styleUrl: './sign-in-form.css'
})
export class SignInForm extends BaseForm implements OnInit {
  protected readonly store = inject(IamStore);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  /**
   * Environment selected in the route.
   */
  protected readonly environment = signal<WorkspaceEnvironment>('qa');

  /**
   * Settings of the selected environment.
   */
  protected readonly profile = computed(() => workspaceEnvironments[this.environment()]);

  /**
   * Whether the password is shown as plain text.
   */
  protected readonly showPassword = signal(false);

  /**
   * Digits of the two-factor code.
   */
  protected readonly codeDigits = signal<string[]>(['', '', '', '', '', '']);

  /**
   * Whether the six digits were entered.
   */
  protected readonly codeComplete = computed(() => this.codeDigits().every(digit => /^\d$/.test(digit)));

  /**
   * Credentials form.
   */
  protected readonly form = new FormGroup({
    email: new FormControl('', {nonNullable: true, validators: [Validators.required, Validators.email]}),
    password: new FormControl('', {nonNullable: true, validators: [Validators.required]})
  });

  /**
   * Reads the environment from the route and starts the flow at the credentials step.
   */
  ngOnInit(): void {
    const key = this.route.snapshot.paramMap.get('environment') as WorkspaceEnvironment;
    if (!(key in workspaceEnvironments)) {
      this.router.navigate(['/sign-in']).then();
      return;
    }
    this.environment.set(key);
    this.store.resetSignIn();
  }

  /**
   * Sends the credentials when the form is valid.
   */
  protected submitCredentials(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const {email, password} = this.form.getRawValue();
    this.store.signIn(new SignInCommand({email: email.trim(), password, environment: this.environment()}));
  }

  /**
   * Stores a typed digit and moves the focus to the next box.
   * @param index - Position of the digit.
   * @param event - Input event of the box.
   */
  protected updateDigit(index: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const digit = input.value.replace(/\D/g, '').slice(-1);
    input.value = digit;
    this.codeDigits.update(digits => digits.map((value, i) => i === index ? digit : value));
    if (digit) (input.nextElementSibling as HTMLInputElement | null)?.focus();
  }

  /**
   * Checks the two-factor code.
   * @param event - Submit event of the code form, cancelled to stay in the page.
   */
  protected submitCode(event: Event): void {
    event.preventDefault();
    if (this.codeComplete()) this.store.verifyTwoFactorCode(this.codeDigits().join(''), this.router);
  }

  /**
   * Returns to the credentials step.
   */
  protected backToCredentials(): void {
    this.codeDigits.set(['', '', '', '', '', '']);
    this.form.controls.password.reset();
    this.store.resetSignIn();
  }

  /**
   * Whether a control is invalid and touched.
   * @param controlName - Name of the control.
   */
  protected isInvalid(controlName: 'email' | 'password'): boolean {
    return this.isInvalidControl(this.form, controlName);
  }
}
