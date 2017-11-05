import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule } from '@angular/material/core';
import {
	CdkTableModule
} from '@angular/cdk/table';
const MATERIAL_MODULES = [
	MatButtonModule,
	MatToolbarModule,
	MatSidenavModule,
	MatIconModule,
	MatListModule,
	MatMenuModule,
	MatCardModule,
	MatFormFieldModule,
	MatInputModule,
	MatDatepickerModule,
	MatNativeDateModule,
	MatSnackBarModule,
	MatTooltipModule,
	MatDialogModule,
	MatRadioModule,
	MatSelectModule,
	MatCheckboxModule,
	MatTableModule,
	MatPaginatorModule
];
const CDK_MODULES = [
	CdkTableModule
]
@NgModule({
	imports: [
		MATERIAL_MODULES,
		CDK_MODULES
	],
	exports: [
		MATERIAL_MODULES,
		CDK_MODULES
	]
})
export class MyMaterialModule { }
