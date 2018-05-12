import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatNativeDateModule } from '@angular/material/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';

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
		{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'standard' } }
	]
})
export class MaterialModule {
	constructor(private dom: DomSanitizer, private iconRegistry: MatIconRegistry) {
		iconRegistry.addSvgIconSetInNamespace('mdi', dom.bypassSecurityTrustResourceUrl('assets/mdi-icons.svg'));
	}
}
