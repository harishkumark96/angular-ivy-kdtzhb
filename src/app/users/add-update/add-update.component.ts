import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators
} from '@angular/forms';
import { first } from 'rxjs/operators';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-update',
  templateUrl: './add-update.component.html'
})
export class AddUpdateComponent implements OnInit {
  form: FormGroup;
  id: any;
  isAddMode: Boolean;
  private sub: Subscription;
  loading = false;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    //   this.sub = this.route.paramMap.subscribe(params => {
    //     this.id = params.get('id'); // (+) converts string 'id' to a number

    //     // In a real app: dispatch action to load the details here.
    //  });
    this.id = this.route.snapshot.paramMap.get('id');
    this.init();
  }
  init() {
    this.isAddMode = !this.id;
    console.log(this.id);
    this.form = this.fb.group({
      fullName: new FormControl('', Validators.required),
      salary: [
        '',
        [Validators.required, Validators.pattern(/\-?\d*\.?\d{1,2}/)]
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [Validators.required, Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]
      ],
      report: ['', Validators.required],
      designation: ['', Validators.required],
      qualification: ['', Validators.required]
    });
    if (!this.isAddMode) {
      this.userService
        .getById(this.id)
        .pipe(first())
        .subscribe(x => this.form.patchValue(x));
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.form.controls;
  }
  onSubmit() {
    this.submitted = true;
    console.log(this.form.value);
    this.loading = true;
    if (this.isAddMode) {
      this.createUser();
    } else {
      this.updateUser();
    }
  }
  formReset() {
    window.location.reload();
  }
  private createUser() {
    console.log('create user is called');
    this.userService
      .create(this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          // this.router.navigate([''], { relativeTo: this.route });
          this.form.reset();
          window.location.reload();
        },
        error: error => {
          this.loading = false;
        }
      });
  }
  private updateUser() {
    console.log('update user is called');
    this.userService
      .update(this.id, this.form.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate(['../../'], { relativeTo: this.route });
        },
        error: error => {
          this.loading = false;
        }
      });
  }
}
