import { Component, OnInit, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/finally';

import { LoginService } from './login.service';
import { PasswordRecoveryService } from './password-recovery.service';

import { FoodWebResponse } from '../../../../../shared/src/message-protocol/food-web-response';
import { AbstractModelDrivenComponent } from '../../common-util/components/abstract-model-driven-component';
import { ValidationService } from '../../common-util/services/validation.service';


@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
    providers: [LoginService, PasswordRecoveryService]
})
export class LoginComponent extends AbstractModelDrivenComponent implements OnInit {

    private _forgotPassword: boolean;
    get forgotPassword(): boolean {
        return this._forgotPassword;
    }

    private _displayRecoveryResponseMessage: boolean;
    get displayRecoveryResponseMessage(): boolean {
        return this._displayRecoveryResponseMessage;
    }

    private _loginError: string;
    get loginError(): string {
        return this._loginError;
    }

    private _showCloseButton: boolean;
    get showCloseButton(): boolean {
        return this._showCloseButton;
    }

    private _showProgressSpinner: boolean;
    get showProgressSpinner(): boolean {
        return this._showProgressSpinner;
    }


    get dialogRef(): MatDialogRef <LoginComponent> {
        return this._dialogRef;
    }


    public constructor (
        validationService: ValidationService,
        private _router: Router,
        private _formBuilder: FormBuilder,
        private _loginService: LoginService,
        private _passwordRecoveryService: PasswordRecoveryService,
        @Optional() private _dialogRef?: MatDialogRef <LoginComponent>
    ) {
        super(validationService)

        this._forgotPassword = false;
        this._displayRecoveryResponseMessage = false;
        this._showCloseButton = false;
        this._showProgressSpinner = false;
    }


    public ngOnInit(): void {

        this._showCloseButton = ( this._router.url !== '/login' );

        this.form = this._formBuilder.group({
            email: [null, Validators.required],
            password: null
        });
    }


    /**
     * Displays the login dialog.
     * @param globalDialogService The global dialog service used to display the dialog popup and associated back-drop.
     * @return A promise that is resolved when a modal is closed and rejected when a modal is dismissed.
     */
    public static display(dialog: MatDialog): Observable <any> {

        let dialogConfig: MatDialogConfig = new MatDialogConfig();
        dialogConfig.maxWidth = 400;
        dialogConfig.hasBackdrop = true;
        dialogConfig.backdropClass = 'login-dialog-backdrop';
        dialogConfig.panelClass = 'login-dialog';
        dialogConfig.autoFocus = false;

        return dialog.open(LoginComponent, dialogConfig).afterClosed();
    }


    /**
     * Performs the login via the Login Service.
     * @param event The form submit or click event that triggered this function.
     */
    private loginUser(event: Event): void {

        event.preventDefault();

        let email: string = this.form.value.email;
        let password: string = this.form.value.password;
        let observer: Observable<FoodWebResponse> = (this._forgotPassword ? this._passwordRecoveryService.recoverPassword(email)
                                                                          : this._loginService.login(email, password));
        this._showProgressSpinner = true;

        observer.finally(() => { this._showProgressSpinner = false; })
                .subscribe (
                    (response: FoodWebResponse) => {

                        console.log(response.message);

                        if (response.success) {
                            
                            this._loginError = null;
                            this._forgotPassword ? this._displayRecoveryResponseMessage = true
                                                 : (this.dialogRef != null) ? this.dialogRef.close() : undefined;

                            // If we are on login, login required, or signup page, then navigate to home on successful sign in.
                            if (this._router.url === '/login' || this._router.url === '/signup' || this._router.url === '/loginRequired') {
                                this._router.navigate(['/home']);
                            }
                        }
                        // Otherwise, failure occured.
                        else { this._loginError = response.message; }
                    },

                    (err: Error) => {
                        console.log(err); // Shouldn't happen!
                    }
                );
    }


    /**
     * Toggles between the login and forgot password form.
     */
    private toggleForgotPassword(): void {
        this._forgotPassword = !this._forgotPassword;
    }
}
