import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgBootstrapFormValidationModule } from 'ng-bootstrap-form-validation';

import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { ListItemComponent } from './list-item/list-item.component';
import { AddUpdateComponent } from './add-update/add-update.component';
import { UsersRoutingModule } from './users-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UsersRoutingModule,
    NgBootstrapFormValidationModule
  ],
  declarations: [LayoutComponent, ListItemComponent, AddUpdateComponent]
})
export class UsersModule {}
