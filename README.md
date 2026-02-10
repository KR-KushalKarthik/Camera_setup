Camera App 📷

A web-based Camera Application built using Angular, designed to capture photos directly from the browser and manage camera-related functionality in a clean and responsive UI.

This project is developed as a personal project to demonstrate frontend development skills using Angular, camera access, and component-based architecture.

🚀 Features

Access device camera using browser APIs

Capture photos in real time

Preview captured images

Delete captured photos

Upload photos to backend server

Clear photos after upload

Modular Angular component structure

Responsive UI design

🛠️ Tech Stack

Frontend: Angular (v19)

Language: TypeScript

Styling: HTML, CSS

Backend: Python (Flask)

API: REST API

Tools: Angular CLI

📂 Project Structure
camera-app/
│
├── src/
│   ├── app/
│   │   ├── camera/
│   │   │   ├── camera.component.ts
│   │   │   ├── camera.component.html
│   │   │   ├── camera.component.css
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │
│   ├── assets/
│   ├── index.html
│   └── main.ts
│
├── angular.json
├── package.json
└── README.md

🔌 API Integration

Captured images are sent from Angular to the backend using HTTP POST requests

Backend API receives and stores uploaded images

Frontend clears images after successful upload

▶️ How to Run the Project
Frontend
npm install
ng serve


Open:

http://localhost:4200

Backend
python app.py


Backend runs on:

http://127.0.0.1:5000

📌 Purpose of the Project

This project helps in understanding:

Camera access in web applications

Angular component-based development

Frontend and backend integration

Real-time image handling in browsers

👨‍💻 Author

Kushal Karthik
B.Tech – Information Technology

If you want, I can also:

✂️ Make this shorter for resume

🗣️ Convert this into interview explanation

📄 Add screenshots section
