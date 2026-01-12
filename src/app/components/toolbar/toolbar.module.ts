import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared.service';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { ToolbarComponent } from './toolbar.component';

const MATERIAL_MODULES = [
  MatButtonModule,
  MatIconModule,
  MatMenuModule,
  MatToolbarModule,
  MatTooltipModule
];

@NgModule({
  declarations: [ToolbarComponent, MenuItemComponent],
  exports: [ToolbarComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    SharedModule,
    RouterModule,
    MATERIAL_MODULES
  ],
})
export class ToolbarModule { }
