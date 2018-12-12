import { FormControl } from '@angular/forms';

export function mobielValidator(control: FormControl): any{
    var myreg = /^(((13[0~9]{1})|(15[0~9]{1})|(18[0~9]{1})|(17[0~9]{1}))+\d{8})$/;
    let valid = myreg.test(control.value);
    return valid ? null : {mobile: true};
}

export function emailValidator(control: FormControl): any{
    var myreg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    let valid = myreg.test(control.value);
    return valid ? null : {email: true};
}

