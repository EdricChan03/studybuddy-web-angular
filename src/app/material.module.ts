import { NgModule } from '@angular/core';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';

import { LayoutModule } from '@angular/cdk/layout';
import { PlatformModule } from '@angular/cdk/platform';

import { DomSanitizer } from '@angular/platform-browser';

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
	MatBadgeModule,
	MatProgressBarModule,
	MatTabsModule,
	MatGridListModule
];
const CDK_MODULES = [
	LayoutModule,
	PlatformModule
];
@NgModule({
	exports: [
		MATERIAL_MODULES,
		CDK_MODULES
	],
	providers: [
		{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'fill' } }
	]
})
export class MaterialModule {
	constructor(private dom: DomSanitizer, private iconRegistry: MatIconRegistry) {
		iconRegistry.addSvgIconSetInNamespace('mdi', dom.bypassSecurityTrustResourceUrl('assets/mdi-icons.svg'));
	}
}
