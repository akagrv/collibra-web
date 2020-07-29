import { Component, OnInit } from "@angular/core";
import { Storage } from "aws-amplify";

@Component({
  selector: "app-storage",
  templateUrl: "./storage.component.html",
  styleUrls: ["./storage.component.scss"],
})
export class StorageComponent implements OnInit {
  files: any[] = [];

  constructor() {}

  ngOnInit() {
    this.displayAllFiles();
  }

  displayAllFiles() {
    // listing files from root path under public acl
    Storage.list("")
      .then((result) => {
        this.files = result;
      })
      .catch((err) => console.log(err));
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
    // default - public level
    Storage.put(file.name, file)
      .then((result) => {
        console.log(result);
        this.displayAllFiles();
      })
      .catch((err) => console.log(err));
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
      return "0 Bytes";
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }
}
