import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { SelectionDialogOption, SharedService } from '../../../shared.service';

interface TestDialog {
  dialogType?: 'alert' | 'confirm' | 'prompt' | 'selection';
  title?: string;
  message?: string;
  positiveBtnText?: string;
  positiveBtnColor?: ThemePalette | '';
  neutralBtnText?: string;
  neutralBtnColor?: ThemePalette | '';
  negativeBtnText?: string;
  negativeBtnColor?: ThemePalette | '';
  placeholder?: string;
  value?: string | number | any;
}
interface TestSnackBar {
  duration?: number;
  action?: string;
  verticalPosition?: MatSnackBarVerticalPosition;
  horizontalPosition?: MatSnackBarHorizontalPosition;
  panelClass?: string[] | string;
  snackBarMsg?: string;
}

@Component({
  selector: 'app-develop-shared-service',
  templateUrl: './shared-service.component.html'
})
export class DevelopSharedServiceComponent implements OnInit {
  dialogTypes = ['alert', 'confirm', 'prompt', 'selection'];
  dialog: TestDialog = {
    positiveBtnColor: '',
    negativeBtnColor: '',
    neutralBtnColor: ''
  };
  snackbar: TestSnackBar = {};
  verticalPos = ['top', 'bottom'];
  horizontalPos = ['start', 'center', 'end', 'left', 'right'];
  dialogBtnColorTypes = [
    {
      value: '',
      viewValue: 'None'
    },
    {
      value: 'primary',
      viewValue: 'Primary'
    },
    {
      value: 'accent',
      viewValue: 'Accent'
    },
    {
      value: 'warn',
      viewValue: 'Warn'
    }
  ];

  constructor(
    public shared: SharedService
  ) {
    shared.title = 'Test page';
  }

  private getValOrReturnDefault(varToSet: any, defaultVal: any): any {
    return varToSet ? varToSet : defaultVal;
  }

  /**
   * Generates lorem ipsum text
   * @param isSnackBar Whether to generate lorem ipsum for the snackbar message
   */
  generateLoremIpsum(isSnackBar?: boolean) {
    // tslint:disable-next-line:max-line-length
    const loremIpsum = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras convallis, libero ac euismod blandit, orci lacus maximus nibh, in iaculis elit elit non magna. Vestibulum elit ante, cursus eu ligula eu, elementum ullamcorper ligula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla facilisis tortor id ante blandit ultrices. Nullam consequat ullamcorper dolor, nec euismod nisl egestas in. Maecenas rutrum a neque a sollicitudin. Sed eleifend ex purus, eu placerat enim varius sed. Integer venenatis, enim eget gravida dictum, justo erat porttitor dui, ac ultricies erat turpis at lacus. Morbi molestie consequat mi a maximus. Vivamus placerat mollis nisl, eu posuere nisi blandit eu. In iaculis, nisl vel tempor accumsan, dolor odio maximus est, nec tempus erat lorem at arcu. In cursus mi et mi ullamcorper, sed pharetra velit placerat. Praesent et nulla condimentum, dignissim diam vel, dictum nulla. Quisque vel risus eu sapien lobortis rhoncus vitae ac quam. Cras diam leo, sagittis molestie augue sit amet, porttitor aliquam justo.';
    if (isSnackBar) {
      this.snackbar.snackBarMsg = loremIpsum;
    } else {
      this.dialog.message = loremIpsum;
    }
  }
  openDialog() {
    switch (this.dialog.dialogType) {
      case 'alert':
        this.openAlertDialog();
        break;
      case 'confirm':
        this.openConfirmDialog();
        break;
      case 'prompt':
        this.openPromptDialog();
        break;
      case 'selection':
        this.openSelectionDialog();
        break;
      default:
        this.openAlertDialog();
        break;
    }
  }

  openAlertDialog() {
    this.shared.openAlertDialog({
      title: this.getValOrReturnDefault(this.dialog.title, 'Alert'),
      msg: this.getValOrReturnDefault(this.dialog.message, 'I\'m an alert message made with code!'),
      negativeBtnText: this.getValOrReturnDefault(this.dialog.negativeBtnText, null),
      negativeBtnColor: this.getValOrReturnDefault(this.dialog.negativeBtnColor, ''),
      neutralBtnText: this.getValOrReturnDefault(this.dialog.neutralBtnText, null),
      neutralBtnColor: this.getValOrReturnDefault(this.dialog.neutralBtnColor, ''),
      positiveBtnText: this.getValOrReturnDefault(this.dialog.positiveBtnText, 'OK'),
      positiveBtnColor: this.getValOrReturnDefault(this.dialog.positiveBtnColor, '')
    });
    this.clearOptions(this.dialog);
  }

  openConfirmDialog() {
    this.shared.openConfirmDialog({
      title: this.getValOrReturnDefault(this.dialog.title, 'Confirmation'),
      msg: this.getValOrReturnDefault(this.dialog.message, 'I\'m a confirm message made with code!'),
      negativeBtnText: this.getValOrReturnDefault(this.dialog.negativeBtnText, 'Cancel'),
      negativeBtnColor: this.getValOrReturnDefault(this.dialog.negativeBtnColor, ''),
      neutralBtnText: this.getValOrReturnDefault(this.dialog.neutralBtnText, null),
      neutralBtnColor: this.getValOrReturnDefault(this.dialog.neutralBtnColor, ''),
      positiveBtnText: this.getValOrReturnDefault(this.dialog.positiveBtnText, 'OK'),
      positiveBtnColor: this.getValOrReturnDefault(this.dialog.positiveBtnColor, '')
    }).afterClosed().subscribe((result) => {
      this.outputResult(result);
    });
    this.clearOptions(this.dialog);
  }

  openPromptDialog() {
    this.shared.openPromptDialog({
      title: this.getValOrReturnDefault(this.dialog.title, 'Prompt'),
      msg: this.getValOrReturnDefault(this.dialog.message, 'Enter your name:'),
      negativeBtnText: this.getValOrReturnDefault(this.dialog.negativeBtnText, 'Cancel'),
      negativeBtnColor: this.getValOrReturnDefault(this.dialog.negativeBtnColor, ''),
      neutralBtnText: this.getValOrReturnDefault(this.dialog.neutralBtnText, null),
      neutralBtnColor: this.getValOrReturnDefault(this.dialog.neutralBtnColor, ''),
      positiveBtnText: this.getValOrReturnDefault(this.dialog.positiveBtnText, 'OK'),
      positiveBtnColor: this.getValOrReturnDefault(this.dialog.positiveBtnColor, ''),
      inputType: 'text',
      placeholder: this.getValOrReturnDefault(this.dialog.placeholder, 'Name'),
      value: this.getValOrReturnDefault(this.dialog.value, null),
      inputConfig: {
        placeholder: 'Placeholder',
        color: 'warn'
      }
    }).afterClosed().subscribe((result) => {
      this.outputResult(result);
    });
    this.clearOptions(this.dialog);
  }
  openSelectionDialog() {
    const selectionDialogOptions: SelectionDialogOption[] = [];
    // for (let i = 0; i < 10; i++) {
    //   if (i === 1) {
    //     tempVar.push({ content: 'Item 1', disabled: true, value: 'item-1' });
    //   } else if (i === 8) {
    //     tempVar.push({ content: 'Item 8', value: 'item-8', selected: true });
    //   } else {
    //     tempVar.push({ content: `Item ${i}`, value: `item-${i}` });
    //   }
    // }
    selectionDialogOptions.push({ content: 'Critical alerts', value: 'critical_alerts', selected: true, disabled: true });
    selectionDialogOptions.push({ content: 'Weekly summary', value: 'weekly_summary' });
    selectionDialogOptions.push({ content: 'New features', value: 'new_features' });
    selectionDialogOptions.push({ content: 'Uncategorised', value: 'uncategorised', selected: true, disabled: true });
    const dialogRef = this.shared.openSelectionDialog({
      title: this.getValOrReturnDefault(this.dialog.title, 'Notification preferences'),
      msg: this.getValOrReturnDefault(this.dialog.message, 'Show preferences for the following'),
      negativeBtnText: this.getValOrReturnDefault(this.dialog.negativeBtnText, 'Cancel'),
      negativeBtnColor: this.getValOrReturnDefault(this.dialog.negativeBtnColor, ''),
      neutralBtnText: this.getValOrReturnDefault(this.dialog.neutralBtnText, null),
      neutralBtnColor: this.getValOrReturnDefault(this.dialog.neutralBtnColor, ''),
      positiveBtnText: this.getValOrReturnDefault(this.dialog.positiveBtnText, 'Save'),
      positiveBtnColor: this.getValOrReturnDefault(this.dialog.positiveBtnColor, ''),
      options: selectionDialogOptions
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.outputResult(JSON.stringify(result));
    });
    this.clearOptions(this.dialog);
  }

  private outputResult(result: any) {
    console.log(`Result: ${result}`);
    document.getElementById('result').innerText = `Result: ${result}`;
  }

  private clearOptions(opts: any) {
    opts = {};
  }
  /**
   * Closes the current snackbar
   */
  closeSnackBar() {
    this.shared.closeSnackBar();
  }
  /**
   * Opens a snackbar
   */
  openSnackBar() {
    this.shared.openSnackBar({
      msg: this.getValOrReturnDefault(this.snackbar.snackBarMsg, 'I\'m a snackbar!'),
      additionalOpts: {
        horizontalPosition: this.snackbar.horizontalPosition,
        verticalPosition: this.snackbar.verticalPosition,
        panelClass: this.snackbar.panelClass
      }
    });
    this.clearOptions(this.snackbar);
  }
  /**
   * Opens an error snackbar
   */
  openErrorSnackBar() {
    this.shared.openSnackBar({
      msg: this.getValOrReturnDefault(this.snackbar.snackBarMsg, 'Error: Something happened'),
      additionalOpts: {
        duration: 5000
      }
    });
  }
  /**
   * Opens a snackbar with a duration
   */
  openDurationSnackBar() {
    this.shared.openSnackBar({
      msg: this.getValOrReturnDefault(this.snackbar.snackBarMsg, 'I\'m a duration snackbar!'),
      additionalOpts: {
        duration: this.snackbar.duration ? this.snackbar.duration : 5000,
        horizontalPosition: this.snackbar.horizontalPosition,
        verticalPosition: this.snackbar.verticalPosition,
        panelClass: this.snackbar.panelClass
      }
    });
    this.clearOptions(this.snackbar);
  }
  /**
   * Opens a snackbar with a result
   */
  openSnackBarWithResult() {
    const snackBarRef = this.shared.openSnackBar({
      msg: this.getValOrReturnDefault(this.snackbar.snackBarMsg, 'I\'m a snackbar with an action!'),
      action: this.snackbar.action,
      additionalOpts:
      {
        horizontalPosition: this.snackbar.horizontalPosition,
        verticalPosition: this.snackbar.verticalPosition,
        panelClass: this.snackbar.panelClass
      }
    });
    snackBarRef.onAction().subscribe(() => {
      this.shared.openAlertDialog({ msg: `You clicked on the "${this.snackbar.action}" button.` });
    });
    this.clearOptions(this.snackbar);
  }

  ngOnInit() {
    this.dialog.dialogType = 'alert';
  }
}
