import { CanActivateFn } from '@angular/router';
import { environment } from '../environments/environment';

export const devGuard: CanActivateFn = () => !environment.production;
