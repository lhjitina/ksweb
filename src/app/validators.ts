import { FormGroup, FormControl } from '@angular/forms';

export function mobielValidator(control: FormControl): any{
    var myreg = /^1[34578]\d{9}$/;
    let valid = myreg.test(control.value);
    return valid ? null : {mobile: true};
}

export function emailValidator(control: FormControl): any{
    var myreg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
    let valid = myreg.test(control.value);
    return valid ? null : {email: true};
}

export function passwdValidator(fg: FormGroup): any{
    var passwd = fg.get("newp") as FormControl;
    var confirm = fg.get("confirm") as FormControl;
    var valid: boolean = (passwd.value === confirm.value);
    console.log("passwd not same");
    return valid? null : {newPasswd: true};
}
