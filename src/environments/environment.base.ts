import { FirebaseAppConfig } from '@angular/fire';
import { Version } from '@angular/core';
import firebase from 'firebase/app';

// This file is the base environment file for all of the environment files that
// inherit from this file

export interface AnalyticsConfig {
  appName?: string;
  appVersion?: string;
  /** Whether to disable the collection of data on this app on this device. */
  disableCollection?: boolean;
  /** Whether debug mode (or `DEBUG_VIEW`) should be enabled. */
  debugMode?: boolean;
}

export interface Environment {
  /** Whether production mode is enabled */
  production?: boolean;
  /** The current version that the app is on. */
  currentVersion?: Version;
  /** Whether to disable router authentication. */
  disableRouterAuth?: boolean;
  /** The Firebase config for the current Firebase app */
  firebase?: {
    apiKey?: string;
    authDomain?: string;
    databaseURL?: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
    measurementId?: string;
  };
  /** Firebase Analytics configuration options */
  analytics?: AnalyticsConfig;
  /** Firebase Remote Config options */
  remoteConfig?: {
    /** Settings to be passed to `CONFIG` from `@angular/fire/remote-config`. */
    settings?: Partial<firebase.remoteConfig.Settings>;
    /** Defaults to be passed to `DEFAULTS` from `@angular/fire/remote-config`. */
    defaults?: {
      [key: string]: string | number | boolean;
    }
  };
}

export const versionStr = '1.0.0';

export const firebaseConfig: FirebaseAppConfig = {
  apiKey: 'AIzaSyCL_ahl9JxGOcCgDX7ka7OnE1lTbqT-xLs',
  authDomain: 'studybuddy-e5f46.firebaseapp.com',
  databaseURL: 'https://studybuddy-e5f46.firebaseio.com',
  projectId: 'studybuddy-e5f46',
  storageBucket: 'studybuddy-e5f46.appspot.com',
  messagingSenderId: '713563449638',
  appId: '1:713563449638:web:e518a1ccfe468413',
  measurementId: 'G-X3VSHQZVJ7'
};

export const analyticsConfig: AnalyticsConfig = {
  appName: 'StudyBuddy for Web',
  appVersion: versionStr,
  debugMode: false,
  disableCollection: false
};

export const currentVersion: Version = new Version(versionStr);

export const baseEnvironment: Environment = {
  currentVersion,
  firebase: firebaseConfig,
  analytics: analyticsConfig,
  disableRouterAuth: false
};
