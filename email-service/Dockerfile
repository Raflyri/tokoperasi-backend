# Gunakan image Node.js sebagai base image
FROM node:20.18.0

# Tentukan direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin file package.json dan package-lock.json ke direktori kerja
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin semua file dari direktori kerja host ke direktori kerja container
COPY . .

# Buka port 3200 untuk mengakses email-service
EXPOSE 3200

# Tentukan perintah untuk menjalankan aplikasi
CMD [ "node", "server.js" ]