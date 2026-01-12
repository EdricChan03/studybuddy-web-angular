import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatLegacySnackBarHorizontalPosition as MatSnackBarHorizontalPosition, MatLegacySnackBarVerticalPosition as MatSnackBarVerticalPosition } from '@angular/material/legacy-snack-bar';
import { SharedService } from '../../../shared.service';

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
  templateUrl: './shared-service.component.html',
  styles: [`
    mat-radio-group mat-radio-button {
      margin: 8px 0;
    }
  `]
})
export class DevelopSharedServiceComponent {
  snackbar: TestSnackBar = {};
  verticalPos = ['top', 'bottom'];
  horizontalPos = ['start', 'center', 'end', 'left', 'right'];

  constructor(
    public shared: SharedService
  ) {
    shared.title = 'Test page';
  }

  private getValOrReturnDefault(varToSet: any, defaultVal: any): any {
    return varToSet ? varToSet : defaultVal;
  }

  generateLoremIpsum() {
    // eslint-disable-next-line max-len
    return 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras convallis, libero ac euismod blandit, orci lacus maximus nibh, in iaculis elit elit non magna. Vestibulum elit ante, cursus eu ligula eu, elementum ullamcorper ligula. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nulla facilisis tortor id ante blandit ultrices. Nullam consequat ullamcorper dolor, nec euismod nisl egestas in. Maecenas rutrum a neque a sollicitudin. Sed eleifend ex purus, eu placerat enim varius sed. Integer venenatis, enim eget gravida dictum, justo erat porttitor dui, ac ultricies erat turpis at lacus. Morbi molestie consequat mi a maximus. Vivamus placerat mollis nisl, eu posuere nisi blandit eu. In iaculis, nisl vel tempor accumsan, dolor odio maximus est, nec tempus erat lorem at arcu. In cursus mi et mi ullamcorper, sed pharetra velit placerat. Praesent et nulla condimentum, dignissim diam vel, dictum nulla. Quisque vel risus eu sapien lobortis rhoncus vitae ac quam. Cras diam leo, sagittis molestie augue sit amet, porttitor aliquam justo.';
  }

  private outputResult(result: any) {
    console.log(`Result: ${result}`);
    document.getElementById('result').innerText = `Result: ${result}`;
  }

  private clearOptions(opts: any) {
    opts = {};
  }

  closeSnackBar() {
    this.shared.closeSnackBar();
  }

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

  openErrorSnackBar() {
    this.shared.openSnackBar({
      msg: this.getValOrReturnDefault(this.snackbar.snackBarMsg, 'Error: Something happened'),
      additionalOpts: {
        duration: 5000
      }
    });
  }

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
      console.log(`The "${this.snackbar.action}" button was clicked.`);
    });
    this.clearOptions(this.snackbar);
  }
}
