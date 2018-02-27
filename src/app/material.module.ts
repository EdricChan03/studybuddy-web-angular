import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';
import { LayoutModule } from '@angular/cdk/layout';
import { PlatformModule } from '@angular/cdk/platform';
const MATERIAL_MODULES = [
	MatButtonModule,
	MatButtonToggleModule,
	MatToolbarModule,
	MatSidenavModule,
	MatAutocompleteModule,
	MatIconModule,
	MatListModule,
	MatMenuModule,
	MatCardModule,
	MatChipsModule,
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
	MatPaginatorModule,
	MatProgressSpinnerModule,
	MatBadgeModule
];
const CDK_MODULES = [
	LayoutModule,
	PlatformModule
];
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
export class MaterialModule { }
