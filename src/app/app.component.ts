import { Component } from '@angular/core';
import { Storage } from 'aws-amplify';
import { AmplifyService } from 'aws-amplify-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  amplifyService: AmplifyService;
  signedIn: boolean;
  user: any;
  show: boolean = false;
  greeting: string;
  files: any[] = [];
  usernameAttributes = "email"; 
  signUpConfig = {
    header: 'Create a new account',
    hideAllDefaults: true,
    defaultCountryCode: '1',
    signUpFields: [
      {
        label: 'Name',
        key: 'name',
        required: true,
        displayOrder: 1,
        type: 'string'
      },
      {
        label: 'Email',
        key: 'email',
        required: true,
        displayOrder: 1,
        type: 'string',
      },
      {
        label: 'Password',
        key: 'password',
        required: true,
        displayOrder: 2,
        type: 'password'
      },
      {
        label: 'Phone Number',
        key: 'phone_number',
        required: true,
        displayOrder: 3,
        type: 'string'
      }
    ]
  };

  constructor(public amplify: AmplifyService) {
    this.amplifyService = amplify;
    // this.Storage = this.amplifyService.storage();
    amplify.auth().currentAuthenticatedUser().then(console.log)
    this.amplifyService.authStateChange$
      .subscribe(authState => {
        this.signedIn = authState.state === 'signedIn';
        if (!authState.user) {
          this.user = null;
        } else {
          debugger
          this.user = authState.user;
          this.greeting = "Hello " + this.user.username;
          this.displayAllFiles();
        }
      });
  }

  displayAllFiles() {
    Storage.list('')
    .then(result => {
      this.files = result;
      console.log(this.files[0]);
    })
    .catch(err => console.log(err));
  }

  /**
   * on file drop handler
   */
  onFileDropped($event) {
    this.prepareFilesList($event);
  }

  /**
   * handle file upload
   */
  fileUploadHandler(files) {
    this.prepareFilesList(files);
  }

  /**
   * Upload process
   */
  uploadFilesToS3(file: File) {
    Storage.put(file.name, file)
        .then (result => {
          console.log(result)
          this.displayAllFiles();
        })
        .catch(err => console.log(err));
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {
      // this.files.push(item);
      this.uploadFilesToS3(item);
    }
    // this.uploadFilesToS3();
    this.displayAllFiles();
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
