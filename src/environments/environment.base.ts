import { FirebaseAppConfig } from '@angular/fire';
import { Version } from '@angular/core';

// This file is the base environment file for all of the environment files that
// inherit from this file

export interface Environment {
  /** Whether production mode is enabled */
  production?: boolean;
  /** The current version that the app is on. */
  currentVersion?: Version;
  /** The Firebase config for the current Firebase app */
  firebase?: FirebaseAppConfig | {
    apiKey?: string;
    authDomain?: string;
    databaseURL?: string;
    projectId?: string;
    storageBucket?: string;
    messagingSenderId?: string;
    appId?: string;
  };
}

export const firebaseConfig: FirebaseAppConfig = {
  apiKey: 'AIzaSyBUoDJ_EL5ht9E4Dj9g5IjyjL4U8DTlyDU',
  authDomain: 'studybuddy-e5f46.firebaseapp.com',
  databaseURL: 'https://studybuddy-e5f46.firebaseio.com',
  projectId: 'studybuddy-e5f46',
  storageBucket: 'studybuddy-e5f46.appspot.com',
  messagingSenderId: '713563449638',
  appId: '1:713563449638:web:e518a1ccfe468413'
};

export const currentVersion: Version = new Version('1.0.0');

export const baseEnvironment: Environment = {
  currentVersion: currentVersion,
  firebase: firebaseConfig
};
