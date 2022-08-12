import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FlatpickrOptions } from 'ng2-flatpickr';
import { FirebaseService } from '../../../services/firebase.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { isNumeric } from 'rxjs/internal-compatibility';
import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../../environments/environment';
import { ImageCroppedEvent, LoadedImage, ImageTransform } from 'ngx-image-cropper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import * as snippet from 'app/main/pages/account-settings/modals.snippetcode';

@Component({
    selector: 'app-account-settings',
    templateUrl: './account-settings.component.html',
    styleUrls: ['./account-settings.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AccountSettingsComponent implements OnInit, OnDestroy {
    // public
    public contentHeader: object;
    public data: any;
    public birthDateOptions: FlatpickrOptions = {
        altInput: true
    };
    public passwordTextTypeOld = false;
    public passwordTextTypeNew = false;
    public passwordTextTypeRetype = false;
    public avatarImage: string;
    public user: any = {};
    public currentUser: any = {};
    public two_factor: boolean;
    public tg_identifier: boolean;
    public telegram_bool = false;
    public factor_login = false;
    public factor_send = false;
    public factor_release = false;
    public reset_error = false;
    public reset_error_text;
    file_data: any = '';
    public file = new FormControl('');
    public uploading: boolean;
    public currencies: any;
    public selected: any;
    public password_response: any;
    public imageChangedEvent: any = '';
    public croppedImage: any = '';
    public canvasRotation = 0;
    public rotation = 0;
    public scale = 1;
    public transform: ImageTransform = {};

    // snippet code variables
    public _snippetCodeBasicModal = snippet.snippetCodeBasicModal;
    public _snippetCodeModalThemes = snippet.snippetCodeModalThemes;
    public _snippetCodeModalSizes = snippet.snippetCodeModalSizes;
    public _snippetCodeEvent = snippet.snippetCodeEvent;
    public _snippetCodeFormScrollingComponents = snippet.snippetCodeFormScrollingComponents;
    // private
    private _unsubscribeAll: Subject<any>;
    private base64Output: string;
    private curr: any;

    /**
     * Constructor
     *
     * @param toastr
     * @param http
     * @param fb
     * @param router
     *  @param {NgbModal} modalService
     */
    constructor(
        private toastr: ToastrService,
        public http: HttpClient,
        private fb: FirebaseService,
        private router: Router,
        private modalService: NgbModal
    ) {
        this._unsubscribeAll = new Subject();
    }

    // Public Methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle Password Text Type Old
     */
    togglePasswordTextTypeOld() {
        this.passwordTextTypeOld = !this.passwordTextTypeOld;
    }

    // modal Open Vertically Centered
    modalOpenVC(modalVC: any) {
        console.log('chance');
        this.modalService.open(modalVC, {
            centered: true
        });
    }

    /**
     * Toggle Password Text Type New
     */
    togglePasswordTextTypeNew() {
        this.passwordTextTypeNew = !this.passwordTextTypeNew;
    }

    /**
     * Toggle Password Text Type Retype
     */
    togglePasswordTextTypeRetype() {
        this.passwordTextTypeRetype = !this.passwordTextTypeRetype;
    }
    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event;
    }
    imageCropped(event: ImageCroppedEvent) {
        this.croppedImage = event.base64;
    }
    imageLoaded(image: LoadedImage) {
        // show cropper
        console.log('show cropper');
    }
    cropperReady() {
        // cropper ready
    }
    loadImageFailed() {
        // show message
    }
    rotate() {
      this.canvasRotation++;    
      this.transform = {
        ...this.transform,
        rotate: this.rotation+=15
    };
  }

  private flipAfterRotate() {
      const flippedH = this.transform.flipH;
      const flippedV = this.transform.flipV;
      this.transform = {
          ...this.transform,
          flipH: flippedV,
          flipV: flippedH
      };
  }

    /**
     * Upload Image
     *
     * @param event
     */
    onFileSelected(event) {
        this.convertFile(event.target.files[0]).subscribe(async (base64) => {
            this.base64Output = base64;
            console.log(base64);
            const fileList: FileList = event.target.files;
            //check whether file is selected or not
            if (fileList.length > 0) {
                const file = fileList[0];
                //get file information such as name, size and type
                console.log('finfo', file.name, file.size, file.type);
                //max file size is 4 mb
                if (file.size / 1048576 <= 4) {
                    this.uploading = true;
                    let user = JSON.parse(localStorage.getItem('user'));
                    const headerDict = {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        token: user.token,
                        username: user.username
                    };
                    const requestOptions = {
                        headers: new Headers(headerDict),
                        method: 'POST',
                        body: JSON.stringify({
                            profile_image: base64,
                            type: file.type
                        })
                    };
                    await fetch(`/uploadProfile`, requestOptions)
                        .then((response) => {
                            console.log(response);
                            if (!response.ok) {
                                this.toast(
                                    'FAILED',
                                    '👋 Seems an error happened .Please try again',
                                    'error'
                                );
                                this.uploading = false;
                                //throw new Error(response.statusText);
                            } else {
                                //reader.readAsDataURL(event.target.files[0]);
                                response.json().then((json) => {
                                    this.avatarImage = json.responseMessage?.path;
                                });
                                this.playAudio('assets/sounds/tirit.wav');
                                this.toast('Great', '👋 You just uploaded your profile', 'success');
                                this.uploading = false;
                            }
                        })
                        .catch((error) => {
                            this.toast('Ops', '👋 An error happened try again', 'error');
                        });
                } else {
                    this.toast(
                        'Ops',
                        'File size exceeds 4 MB. Please choose less than 4 MB',
                        'error'
                    );
                }
            }
        });
    }

    convertFile(file: File): Observable<string> {
        const result = new ReplaySubject<string>(1);
        const reader = new FileReader();
        reader.readAsBinaryString(file);
        reader.onload = (event) => result.next(btoa(event.target.result.toString()));
        return result;
    }

    async uploadImage(event: any) {
        if (event.target.files && event.target.files[0]) {
            let reader = new FileReader();

            reader.onload = (event: any) => {
                this.avatarImage = event.target.result;
                console.log(event.target.result);
            };
        }
    }

    playAudio(path) {
        let audio = new Audio();
        audio.src = path;
        audio.load();
        audio.play();
    }

    private toast(title: string, message: string, type: string) {
        if (type == 'success') {
            this.toastr.success(message, title, {
                toastClass: 'toast ngx-toastr',
                timeOut: 5000,
                closeButton: true,
                positionClass: 'toast-top-right',
                progressBar: true
            });
        } else {
            this.toastr.error(message, title, {
                toastClass: 'toast ngx-toastr',
                timeOut: 5000,
                closeButton: true,
                positionClass: 'toast-top-right',
                progressBar: true
            });
        }
    }

    // Lifecycle Hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit() {
        this.user = JSON.parse(localStorage.getItem('user'));
        this.fb.getUser(this.user.username, this.user.token).subscribe(
            (data: any) => {
                this.currentUser = data.responseMessage?.user_data[0];
                this.avatarImage = this.currentUser.profile_link;
                this.tg_identifier = this.currentUser.tg_hash_identifier;

                if (this.currentUser.tg_id == 'NA') {
                    this.telegram_bool = false;
                } else {
                    this.telegram_bool = true;
                }
                if (this.currentUser.choice_2fa == '2FA') {
                    this.two_factor = true;
                } else {
                    this.two_factor = false;
                }
                this.factor_login = this.currentUser.factor_login;
                this.factor_send = this.currentUser.factor_send;
                this.factor_release = this.currentUser.factor_release;

                //console.log(data)
            },
            (error) => {
                console.log(error);
                this.router.navigate(['/dashboard/overview']);
            }
        );
        this.fb.getCurrency().subscribe(
            (data: any) => {
                this.currencies = data.responseMessage.currencies;
            },
            (error) => {
                console.log(error);
            }
        );
        this.contentHeader = {
            headerTitle: 'Account Settings',
            actionButton: true,
            breadcrumb: {
                type: '',
                links: [
                    {
                        name: 'Personalize my account',
                        isLink: false
                    }
                ]
            }
        };
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    openLink() {
        const link = 'https://t.me/CoinPesBot?start=' + this.tg_identifier;
        window.open(link, '_blank') || window.location.replace(link);
    }

    set2FA() {
        const otp = (document.getElementById('2fa_otp') as HTMLInputElement).value;
        console.log(otp);
        let user = JSON.parse(localStorage.getItem('user'));

        if (otp.length <= 0) {
            this.fireSwalError(
                'OTP REQUIRED',
                'Scan the QR-code with your phone by using the Authy app. A 6-digit code will appear on the app. Enter the 6-digit code into the field below the QR-code'
            );
            return;
        }
        if (otp.length > 6) {
            this.fireSwalError(
                'OTP TOO LONG',
                'Your 2FA code cannot be longer than 6 numbers. Get your code from Authy or Google Authenticator'
            );
            return;
        }
        if (otp.length > 0 && otp.length < 6) {
            this.fireSwalError(
                'OTP TOO SHORT',
                'Your 2FA code cannot be shorter than 6 numbers. Get your code from Authy or Google Authenticator'
            );
            return;
        }
        if (otp.length > 0 && !isNumeric(parseInt(otp))) {
            this.fireSwalError(
                'OTP MUST BE A NUMBER',
                'Your 2FA code must be a 6 digit number. Get your code from Authy or Google Authenticator'
            );
            return;
        } else {
            this.fb
                .set2FAAuth(this.user.token, this.user.username, {
                    email: user.email,
                    otp: otp
                })
                .subscribe(
                    (response: any) => {
                        this.two_factor = true;
                        this.factor_login = true;
                        this.factor_send = true;
                        this.factor_release = true;
                        console.log(response.responseMessage);
                        this.fireSwalSuccess(
                            'DONE',
                            "You are now protected with 2FA.  Even if an intruder gets past your password, that's no longer enough to give unauthorized access: without approval of your 2FA Code"
                        );
                    },
                    (err) => {
                        this.two_factor = false;
                        this.fireSwalError('Ops', err.error.responseMessage);

                        console.log(err.error);
                    }
                );
        }
    }

    fireSwalError(title: string, message: string) {
        Swal.fire({
            title: title,
            html: message,
            icon: 'error',
            confirmButtonText: 'OKAY',
            customClass: { confirmButton: 'btn btn-primary' }
        });
    }

    fireSwalSuccess(title: string, message: string) {
        Swal.fire({
            title: title,
            html: message,
            icon: 'success',
            confirmButtonText: 'OKAY',
            customClass: { confirmButton: 'btn btn-primary' }
        });
    }

    change2FA(button: string) {
        function toggle2FA(otp: string, action: string) {
            console.log('otp: ' + otp + ' button: ' + action);
            let user = JSON.parse(localStorage.getItem('user'));

            function fireAlert(sign: any, title: string, msg: string) {
                Swal.fire({
                    title: title,
                    html: msg,
                    icon: sign,
                    confirmButtonText: 'OKAY',
                    customClass: { confirmButton: 'btn btn-primary' }
                });
            }

            fetch(`${environment.endpoint}/toggle2FA`, {
                method: 'POST', // or 'PUT'
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    token: user.token,
                    username: user.username
                },
                body: JSON.stringify({
                    type: action,
                    email: user.email,
                    otp: otp
                })
            }).then(async (response) => {
                const json = await response.json(); // Get JSON value from the response
                console.log(json);
                if (response.status == 200) {
                    fireAlert(
                        'success',
                        'DONE',
                        'You updated your 2FA. Never share your 2FA codes. If someone asks for it please neglect and report to support'
                    );
                    //Here look for way to update ui with data
                } else {
                    fireAlert('error', 'Ops', json.responseMessage.msg);
                }
            });
        }

        Swal.mixin({
            input: 'text',
            confirmButtonText: 'CONFIRM',
            showCancelButton: true,
            progressSteps: ['1', '2'],
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-danger ml-1'
            }
        })
            .queue([
                {
                    title: '2FA CODE',
                    text: 'Get your code from Authy or Google Authenticator to authorize this action'
                }
            ])
            .then(function (result) {
                function fireSwal(option: string, title: string, msg: string) {
                    Swal.fire({
                        title: title,
                        html: msg,
                        icon: 'error',
                        confirmButtonText: 'OKAY',
                        customClass: { confirmButton: 'btn btn-primary' }
                    });
                }

                if ((<HTMLInputElement>result).value) {
                    console.log((<HTMLInputElement>result).value);
                    let otp = (<HTMLInputElement>result).value[0];
                    console.log(otp);
                    if (otp.length <= 0) {
                        fireSwal(
                            'error',
                            'OTP REQUIRED',
                            'Please input the 2FA Code. Get your code from Authy or Google Authenticator to authorize this action'
                        );
                        return;
                    }
                    if (otp.length > 6) {
                        fireSwal(
                            'error',
                            'OTP TOO LONG',
                            'Your 2FA code cannot be longer than 6 numbers. Get your code from Authy or Google Authenticator'
                        );
                        return;
                    }
                    if (otp.length > 0 && otp.length < 6) {
                        fireSwal(
                            'error',
                            'OTP TOO SHORT',
                            'Your 2FA code cannot be shorter than 6 numbers. Get your code from Authy or Google Authenticator'
                        );
                        return;
                    }
                    if (otp.length > 0 && !isNumeric(parseInt(otp))) {
                        fireSwal(
                            'error',
                            'OTP MUST BE A NUMBER',
                            'Your 2FA code must be a 6 digit number. Get your code from Authy or Google Authenticator'
                        );
                        return;
                    } else {
                        toggle2FA(otp, button);
                    }
                }
            });
    }

    changePassword() {
        const old_password = (document.getElementById('account-old-password') as HTMLInputElement)
            .value;
        const new_password = (document.getElementById('account-new-password') as HTMLInputElement)
            .value;
        const new_password_confirm = (
            document.getElementById('account-retype-new-password') as HTMLInputElement
        ).value;
        if (
            old_password.length <= 0 ||
            new_password.length <= 0 ||
            new_password_confirm.length <= 0
        ) {
            this.reset_error_text = 'Please fill in all fields';
            this.reset_error = true;
            return;
        }
        this.reset_error = false;
        console.log(this.user.email + this.user.username);
        this.fb
            .setChangePaswordInApp(this.user.token, this.user.username, {
                username: this.user.username,
                pass1: new_password,
                pass2: new_password_confirm,
                old_password: old_password
            })
            .subscribe(
                (response: any) => {
                    this.router.navigate(['pages/login']);
                },
                (err) => {
                    this.reset_error_text = err.error.responseMessage;
                    this.reset_error = true;
                }
            );
    }

    resetProfile() {
        this.uploading = true;
        this.fb.resetProfile(this.user.token, this.user.username).subscribe(
            (data: any) => {
                console.log(data);
                this.avatarImage = data.responseMessage?.path;
                this.uploading = false;
                this.playAudio('assets/sounds/tirit.wav');
                this.toast(
                    'Great',
                    '👋 You just reset your profile. Adding one helps you become easily identifiable on the market place',
                    'success'
                );
            },
            (error) => {
                console.log(error);
                this.toast('Ops', '👋 Seems an error happened', 'error');
                this.uploading = false;
            }
        );
    }

    saveProfile() {
        this.uploading = true;
        let about = (<HTMLInputElement>document.getElementById('about')).value;
        if (about.length <= 5) {
            this.playAudio('assets/sounds/windows_warning.wav');
            this.toast('Sorry', '👋 About must be greater than 20 characters', 'error');
            return;
        }
        if (about.length >= 50) {
            this.playAudio('assets/sounds/windows_warning.wav');
            this.toast('Sorry', '👋 About cannot be greater than 255 characters', 'error');
            return;
        }

        this.fb
            .updateProfile(this.user.token, this.user.username, {
                currency: this.curr,
                about: about
            })
            .subscribe(
                (response: any) => {
                    this.uploading = false;
                    this.playAudio('assets/sounds/tirit.wav');
                    this.toast(
                        'Great',
                        '👋 You just updated your profile. You are now up to date to the latest',
                        'success'
                    );
                },
                (err) => {
                    console.log(err);
                    this.uploading = false;
                    this.playAudio('assets/sounds/windows_warning.wav');
                    this.toast('Hmm', '👋 ' + err.error.responseMessage, 'error');
                }
            );
        console.log(this.curr + ' ' + about);
    }

    onSelected(val) {
        console.log(val.selectedItems[0].label);
        this.curr = val.selectedItems[0].label;
    }

    resendConfirmation() {
        this.uploading = true;
        this.fb
            .sendConfirmEmail({
                email: this.user.email
            })
            .subscribe(
                (response: any) => {
                    this.uploading = false;
                    this.playAudio('assets/sounds/tirit.wav');
                    this.toast(
                        'Great',
                        '👋 Check your inbox. If you cannot see the confirmation email, check your spam folder',
                        'success'
                    );
                },
                (err) => {
                    console.log(err);
                    this.uploading = false;
                    this.playAudio('assets/sounds/windows_warning.wav');
                    this.toast('Hmm', '👋 ' + err.error.responseMessage, 'error');
                }
            );
    }
}
