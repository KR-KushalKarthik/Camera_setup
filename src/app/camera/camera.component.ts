import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.css']
})
export class CameraComponent {
  @ViewChild('video') video!: ElementRef<HTMLVideoElement>;

  photos: { img: string, time: string, date: string, lat?: number, lng?: number, uploaded?: boolean }[] = [];
  previewPhoto: string | null = null;
  uploading: boolean = false;
  currentTime: string = '';
  currentDate: string = '';
  currentLat: number | null = null;
  currentLng: number | null = null;

  constructor(private http: HttpClient) {}

  startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        this.video.nativeElement.srcObject = stream;
        this.updateDateTime();
      })
      .catch(err => console.error("Error accessing camera:", err));
  }

  updateDateTime() {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString();
    this.currentDate = now.toLocaleDateString();
    setTimeout(() => this.updateDateTime(), 1000);
  }

  capturePhoto() {
    const videoEl = this.video.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = videoEl.videoWidth;
    canvas.height = videoEl.videoHeight;

    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(videoEl, 0, 0);

    // Get location only on capture
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        this.currentLat = pos.coords.latitude;
        this.currentLng = pos.coords.longitude;

        // Overlay date, time, and location
        ctx.font = "25px Arial";
        ctx.fillStyle = "yellow";
        ctx.fillText(`Date: ${this.currentDate}`, 20, 40);
        ctx.fillText(`Time: ${this.currentTime}`, 20, 70);
        ctx.fillText(`Lat: ${this.currentLat?.toFixed(5)}`, 20, 100);
        ctx.fillText(`Lng: ${this.currentLng?.toFixed(5)}`, 20, 130);

        this.previewPhoto = canvas.toDataURL('image/png');
      }, err => {
        console.warn('Location not available', err);

        // Overlay only date and time if location denied
        ctx.font = "25px Arial";
        ctx.fillStyle = "yellow";
        ctx.fillText(`Date: ${this.currentDate}`, 20, 40);
        ctx.fillText(`Time: ${this.currentTime}`, 20, 70);

        this.previewPhoto = canvas.toDataURL('image/png');
      });
    } else {
      // Overlay only date and time if geolocation not supported
      ctx.font = "25px Arial";
      ctx.fillStyle = "yellow";
      ctx.fillText(`Date: ${this.currentDate}`, 20, 40);
      ctx.fillText(`Time: ${this.currentTime}`, 20, 70);

      this.previewPhoto = canvas.toDataURL('image/png');
    }
  }

  savePhoto() {
    if (!this.previewPhoto) return;

    this.photos.push({
      img: this.previewPhoto,
      time: this.currentTime,
      date: this.currentDate,
      lat: this.currentLat || undefined,
      lng: this.currentLng || undefined,
      uploaded: false
    });

    this.previewPhoto = null;
    this.currentLat = null;
    this.currentLng = null;
  }

  cancelPreview() {
    this.previewPhoto = null;
    this.currentLat = null;
    this.currentLng = null;
  }

  retakePhoto(index: number) {
    this.photos.splice(index, 1);
  }

  deletePhoto(index: number) {
    this.photos.splice(index, 1);
  }

  uploadPhoto(photo: { img: string, time: string, date: string, uploaded?: boolean }) {
    const uploadUrl = 'http://127.0.0.1:5000/upload';
    return this.http.post(uploadUrl, { image: photo.img }).toPromise()
      .then(() => photo.uploaded = true)
      .catch(err => console.error('Upload failed:', err));
  }

  async uploadAll() {
    if (this.photos.length === 0) return;

    this.uploading = true;

    for (const p of this.photos) {
      if (!p.uploaded) {
        await this.uploadPhoto(p);
      }
    }

    this.uploading = false;
    alert('All photos uploaded successfully!');
    this.clearAll();
  }

  clearAll() {
    this.photos = [];
  }
}
