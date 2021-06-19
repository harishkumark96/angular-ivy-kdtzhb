import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from './layout/layout.component';
import { ListItemComponent } from './list-item/list-item.component';
import { AddUpdateComponent } from './add-update/add-update.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: ListItemComponent },
      { path: 'add', component: AddUpdateComponent },
      { path: 'edit/:id', component: AddUpdateComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {}
