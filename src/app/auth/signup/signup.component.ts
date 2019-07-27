import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { NgForm, FormControl } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';

import { AuthService } from '../auth.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { AngularMaterialModule } from '../../angular-material.module';
// import { constructor } from 'q';
import { startWith, map } from 'rxjs/operators';
import { MatAutocomplete, MatChipInputEvent, MatAutocompleteSelectedEvent } from '@angular/material';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {
  isLoading = false;
  private authStatusSub: Subscription;
  public interests: string[];

  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  categoryCtrl = new FormControl();
  filteredCategories: Observable<string[]>;
  categories: string[] = [];
  allCategories: string[] = ['Technology', 'Business', 'Party', 'Family', 'Festival', 'Sports', 'Chill'];

  @ViewChild('categoryInput') categoryInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;


  constructor(public authService: AuthService
    ) {
      this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
        startWith(null),
        map((category: string | null) => category ? this._filter(category) : this.allCategories.slice()));
    }

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
  }

  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    this.authService.createUser(
          form.value.email,
          form.value.password,
          form.value.name,
          false);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  addT() {
    this.interests.push('Technology');
  }
  addF() {
    this.interests.push('Festival');
  }
  addS() {
    this.interests.push('Sports');
  }
  addP() {
    this.interests.push('Party');
  }
  addC() {
    this.interests.push('Chill');
  }
  addB() {
    this.interests.push('Business');
  }



  add(event: MatChipInputEvent): void {
    // Add fruit only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if (!this.matAutocomplete.isOpen) {
      const input = event.input;
      const value = event.value;

      // Add our fruit
      if ((value || '').trim()) {
        this.categories.push(value.trim());
      }

      // Reset the input value
      if (input) {
        input.value = '';
      }

      this.categoryCtrl.setValue(null);
    }
  }

  remove(category: string): void {
    const index = this.categories.indexOf(category);

    if (index >= 0) {
      this.categories.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.categories.push(event.option.viewValue);
    this.categoryInput.nativeElement.value = '';
    this.categoryCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allCategories.filter(category => category.toLowerCase().indexOf(filterValue) === 0);
  }
}
