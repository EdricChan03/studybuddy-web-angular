import { NgModule } from '@angular/core';
import {
	MdButtonModule,
	MdToolbarModule,
	MdSidenavModule,
	MdIconModule,
	MdListModule,
	MdMenuModule,
	MdCardModule,
	MdFormFieldModule,
	MdInputModule,
	MdDatepickerModule,
	MdNativeDateModule,
	MdSnackBarModule,
	MdTooltipModule,
	MdDialogModule,
	MdRadioModule,
	MdSelectModule,
    MdCheckboxModule
} from '@angular/material';
const MATERIAL_MODULES = [
	MdButtonModule,
	MdToolbarModule,
	MdSidenavModule,
	MdIconModule,
	MdListModule,
	MdMenuModule,
	MdCardModule,
	MdFormFieldModule,
	MdInputModule,
	MdDatepickerModule,
	MdNativeDateModule,
	MdSnackBarModule,
	MdTooltipModule,
	MdDialogModule,
	MdRadioModule,
	MdSelectModule,
	MdCheckboxModule
];
@NgModule({
	imports: [
		MATERIAL_MODULES
	],
	exports: [
		MATERIAL_MODULES
	]
})
export class MyMaterialModule { }
