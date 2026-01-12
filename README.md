# PiHole Analysis Tool
An extension to PiHole, enabling analysis of DNS behaviour within the network. Automatically interrogate domains, flag domains as suspicious, and identify trends.

![Screenshot](image.png)

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository
```bash
git clone https://github.com/tom-acco/pihole-analysis.git
cd pihole-analysis
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

### Backend Configuration

Create a `.env` file in the `backend` directory with the following configuration:

```env
PIHOLE_URL="http://192.168.1.10"
PIHOLE_DUMP_PORT="8888"
PIHOLE_DUMP_KEY="PASSWORD"

WEB_ADDR="127.0.0.1"
WEB_PORT="8000"
WEB_SECRET="SOME_OTHER_PASSWORD"

OPENAI_ENABLE="false"
OPENAI_KEY="sk-...(optional)"
```

Update the values according to your PiHole setup.

### Building the Project

#### Build Backend
```bash
cd backend
npm run build
```
This compiles the TypeScript code to JavaScript in the `dist` directory.

#### Build Frontend
```bash
cd frontend
npm run build
```
This creates an optimized production build in the `../backend/www` directory.

### Running the Project

#### Development Mode

For development, run both the backend and frontend in separate terminal windows:

**Backend**
```bash
cd backend
npm run dev
```
The backend will run with hot-reload on the port specified in your `.env` file (default: 8000).

**Frontend**
```bash
cd frontend
npm run dev
```
The frontend dev server will start (typically on `http://localhost:3000`).

#### Production Mode

**Backend:**
```bash
cd backend
npm run build
npm start
```

## PiHole Setup
The following guide will configure the PiHole to export 24 hours worth of query results (domain, client, count) to an encrypted file, accessible via a web server on a separate port.

### Install & Configure nginx
Install nginx
```
sudo apt install nginx
```

Create a new www path
```
sudo mkdir -p /var/www/html/dump
```

Modify the default nginx site

```
sudo nano /etc/nginx/sites-available/default
```

Change the listen port to '8888'

```
listen 8888 default_server;
listen [::]:8888 default_server;
```

Change the root path to '/var/www/html/dump'
```
root /var/www/html/dump;
```

Save and exit the file

Enable and start the nginx service

```
sudo systemctl enable nginx
sudo systemctl start nginx
```

## Configure The Exporter
Copy the contents of the [dump.sh](./backend/scripts/dump.sh) script to `/root`


Create a cron job to run the script

```
sudo crontab -e
```

Add the following line, feel free to change the frequency:

```
*/30 * * * * ~/dump.sh PASSWORD
```

Be sure to change 'PASSWORD' to something else