import { FormControl } from "@angular/forms";

export interface LoginFormGroup {
  nickname: FormControl<string | null>;
}
