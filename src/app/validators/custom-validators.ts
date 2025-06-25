import { FormControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
    //validasi spasi kosong
    static notOnlyWhitespace(control: FormControl): ValidationErrors {
        //cek apakah string hanya berisi spasi kosong
        if ((control.value != null) && (control.value.trim().length === 0)) {
            //invalid, return error object
            return { 'notOnlyWhitespace': true };
        } else {
            //valid, return null
            return null;
        }
    }
}
