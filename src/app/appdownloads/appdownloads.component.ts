import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material';
import { MarkdownDialogComponent, MarkdownDialogConfig } from '../dialogs/markdown-dialog/markdown-dialog.component';

interface DownloadUrl {
  downloadUrl: string;
  version: string;
  changes?: string;
  ghReleaseUrl?: string;
  isPreRelease?: boolean;
  releaseName?: string;
}
@Component({
  selector: 'app-appdownloads',
  templateUrl: './appdownloads.component.html'
})
export class AppDownloadsComponent implements OnInit {

  androidDownloadUrls: DownloadUrl[];
  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    public shared: SharedService
  ) {
    shared.title = 'App downloads';
  }

  ngOnInit() {
    this.androidDownloadUrls = [];
    this.createGhReleasesApiReq('Chan4077', 'StudyBuddy')
      .subscribe(result => {
        console.log(result);
        this.androidDownloadUrls = result.map(e => {
          const rObj = {};
          /*
          JSON structure
          assets: [
            {
              url: '...',
              ...,
              browser_download_url: '...'
            }
          ]
          */
          if (typeof e['assets'] !== 'undefined' && e['assets'].length > 0) {
            rObj['downloadUrl'] = e['assets'][0]['browser_download_url'];
          } else {
            console.warn(`No assets exist for the tag ${e['tag_name']}!`);
          }
          rObj['version'] = e['tag_name'];
          rObj['ghReleaseUrl'] = e['html_url'];
          rObj['isPreRelease'] = e['prerelease'];
          rObj['releaseName'] = e['name'];
          rObj['changes'] = e['body'];
          return rObj;
        });
      });
  }

  showChangesDialog(event: MouseEvent, downloadUrl: DownloadUrl) {
    event.stopImmediatePropagation();
    event.preventDefault();
    const dialogRef = this.dialog.open<MarkdownDialogComponent, MarkdownDialogConfig>(MarkdownDialogComponent, {
      data: {
        title: 'Changelog',
        text: downloadUrl.changes,
        hasPositiveDialogBtn: true,
        positiveDialogBtnText: 'Dismiss'
      }
    });
  }

  /**
   * Creates a HTTP GET request to the GitHub Releases API
   * @param owner The owner of the repository
   * @param repo The repository's name
   * @return A HTTP GET request
   */
  private createGhReleasesApiReq(owner: string, repo: string): Observable<any> {
    return this.http.get(`https://api.github.com/repos/${owner}/${repo}/releases`);
  }
  /**
   * Retrieves the download URL of a particular tag
   * @param tag The tag
   * @return The download URL
   */
  private getDownloadUrl(tag: string): string {
    return `https://github.com/Chan4077/StudyBuddy/releases/download/${tag}/com.edricchan.studybuddy-${tag}.apk`;
  }

  /**
   * Retrieves the GitHub release URL of a particular tag
   * @param tag The tag
   * @return The GitHub release URL
   */
  private getGhReleaseUrl(tag: string): string {
    return `https://github.com/Chan4077/StudyBuddy/releases/tag/${tag}`;
  }
}
