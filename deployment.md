  # 🚀 Production Deployment Rehberi

  ## ⭐ ÖNERİLEN: Vercel + Render + MongoDB Atlas (Custom Domain ile)

  **Bu yöntem neden en iyi:**
  - ✅ Tamamen ücretsiz (domain hariç: ~$10/yıl)
  - ✅ Otomatik SSL sertifikaları
  - ✅ GitHub ile otomatik deployment
  - ✅ Custom domain desteği
  - ✅ Professional görünüm
  - ✅ Kolay yönetim (3 platform)
  - ✅ Ölçeklenebilir

  **Toplam Maliyet:** ~$10/yıl (sadece domain)

  ---

  ### 📋 Gereksinimler

  - GitHub hesabı
  - Vercel hesabı (GitHub ile ücretsiz)
  - Render hesabı (GitHub ile ücretsiz)
  - MongoDB Atlas hesabı (ücretsiz)
  - Domain (~$10/yıl - Cloudflare Registrar önerilir)

  ---

  ### ADIM 1: MongoDB Atlas Setup (5 dakika)

  **1.1. Hesap Oluştur**
  ```
  1. https://www.mongodb.com/cloud/atlas/register adresine git
  2. Google veya GitHub ile sign up yap
  3. Email'i verify et
  ```

  **1.2. Free Cluster Oluştur**
  ```
  1. "Create a Deployment" butonuna tıkla
  2. Deployment Type: M0 (Free) seç
  3. Cloud Provider: AWS
  4. Region: eu-north-1 (Stockholm) - En yakın bölge
  5. Cluster Name: blog-post-cluster
  6. "Create Deployment" butonuna tıkla
  7. Bekle (2-3 dakika)
  ```

  **1.3. Database User Oluştur**
  ```
  1. Sol menüden "Security" → "Database Access"
  2. "Add New Database User" butonuna tıkla
  3. Authentication Method: Password
  4. Username: blogpostuser (veya istediğin isim)
  5. Password: Güçlü bir şifre oluştur ve KAYDET! (sonra lazım olacak)
  6. Database User Privileges: "Read and write to any database"
  7. "Add User" butonuna tıkla
  ```

  **1.4. Network Access Ayarla**
  ```
  1. Sol menüden "Security" → "Network Access"
  2. "Add IP Address" butonuna tıkla
  3. "Allow Access from Anywhere" seç (0.0.0.0/0)
  4. "Confirm" butonuna tıkla

  ⚠️ Production'da daha güvenli: Sadece Render IP'lerini whiteliste ekle
  ```

  **1.5. Connection String Al**
  ```
  1. Sol menüden "Database" → "Clusters"
  2. Cluster'ının yanındaki "Connect" butonuna tıkla
  3. "Drivers" seç
  4. Driver: Node.js, Version: 5.5 or later
  5. Connection string'i kopyala:
     mongodb+srv://blogpostuser:<password>@blog-post-cluster.xxxxx.mongodb.net/

  6. Connection string'i düzenle:
     - <password> kısmını kendi şifrenle değiştir
     - Son kısma database ismini ekle: /blog-post

  Örnek:
  mongodb+srv://blogpostuser:MyStr0ngP@ss@blog-post-cluster.abc123.mongodb.net/blog-post

  ⚠️ Bu string'i kaydet! Backend deployment'ta lazım olacak.
  ```

  ---

  ### ADIM 2: Backend Deploy (Render) - 10 dakika

  **2.1. Kodu Hazırla**
  ```bash
  # Blog-post-server klasöründe
  cd blog-post-server

  # .gitignore kontrolü (node_modules ve .env ignore edilmeli)
  cat .gitignore

  # GitHub'a push et
  git add .
  git commit -m "Prepare backend for deployment"
  git push origin main
  ```

  **2.2. Render Hesabı Oluştur**
  ```
  1. https://render.com/ adresine git
  2. "Get Started for Free" butonuna tıkla
  3. GitHub ile sign up yap
  4. GitHub repo'larına erişim izni ver
  ```

  **2.3. Web Service Oluştur**
  ```
  1. Dashboard'da "New +" butonuna tıkla
  2. "Web Service" seç
  3. GitHub repository seç: blog-post-app (veya repo adın)
  4. "Connect" butonuna tıkla
  ```

  **2.4. Service Ayarları**
  ```
  Name: blog-post-api (veya istediğin isim)
  Region: Frankfurt (EU Central)
  Branch: main
  Root Directory: blog-post-server
  Runtime: Node
  Build Command: npm install
  Start Command: npm start
  Instance Type: Free
  ```

  **2.5. Environment Variables Ekle**
  ```
  "Advanced" sekmesine geç
  "Add Environment Variable" butonuna tıkla

  Şu değişkenleri ekle:

  PORT=3000

  MONGO_URI=mongodb+srv://blogpostuser:SIFRE@cluster.xxxxx.mongodb.net/blog-post
  (MongoDB Atlas'tan aldığın connection string'i yapıştır)

  JWT_SECRET=super_secret_production_key_change_this_to_random_string
  (Güvenli, uzun, rastgele bir string kullan)

  # AWS S3 kullanıyorsan (opsiyonel):
  AWS_ACCESS_KEY_ID=your_aws_access_key
  AWS_SECRET_ACCESS_KEY=your_aws_secret_key
  AWS_REGION=eu-north-1
  AWS_BUCKET_NAME=your_bucket_name

  # Google Maps API Key (opsiyonel):
  VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
  ```

  **2.6. Deploy Et**
  ```
  1. "Create Web Service" butonuna tıkla
  2. Deployment başlayacak (5-10 dakika sürer)
  3. Logs'u takip et:
     - "npm install" çalışıyor
     - "npm start" çalışıyor
     - "MongoDB connected successfully" görmelisin
     - "Sunucu 3000 portunda çalışıyor" görmelisin

  4. Deploy tamamlandığında şunu göreceksin:
     "Your service is live 🎉"
     URL: https://blog-post-api-xxxxx.onrender.com
  ```

  **2.7. Backend'i Test Et**
  ```bash
  # Terminal'de test et
  curl https://blog-post-api-xxxxx.onrender.com

  # Çıktı:
  # "Hoş geldiniz! Express + MongoDB API çalışıyor!"

  # API endpoints test et
  curl https://blog-post-api-xxxxx.onrender.com/api/blogs
  curl https://blog-post-api-xxxxx.onrender.com/api/categories
  ```

  **2.8. Database'e Data Yükle**
  ```bash
  # Local'de blog-post-server/.env dosyasını aç
  # MONGO_URI'ı cloud connection string ile güncelle

  MONGO_URI=mongodb+srv://blogpostuser:SIFRE@cluster.xxxxx.mongodb.net/blog-post

  # Migration'ı çalıştır
  cd blog-post-server
  node migrations/seed-blog-data.js

  # Çıktı:
  # ✓ MongoDB connected
  # ✓ Created 5 categories
  # ✓ Created 25 blogs
  # ✨ Database seeding completed successfully!
  ```

  ---

  ### ADIM 3: Frontend Deploy (Vercel) - 5 dakika

  **3.1. Frontend'i Hazırla**
  ```bash
  cd blog-post-client

  # .env dosyasını güncelle
  # Backend URL'i Render'dan aldığın URL ile değiştir

  VITE_API_URL=https://blog-post-api-xxxxx.onrender.com/api
  VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

  # Değişiklikleri commit et
  git add .
  git commit -m "Update API URL for production"
  git push origin main
  ```

  **3.2. Vercel Hesabı Oluştur**
  ```
  1. https://vercel.com/ adresine git
  2. "Start Deploying" butonuna tıkla
  3. GitHub ile sign up yap
  4. GitHub repo'larına erişim izni ver
  ```

  **3.3. Project Import Et**
  ```
  1. Dashboard'da "Add New..." → "Project"
  2. "Import Git Repository" bölümünde repo'nu seç: blog-post-app
  3. "Import" butonuna tıkla
  ```

  **3.4. Project Ayarları**
  ```
  Framework Preset: Vite (otomatik algılanır)
  Root Directory: blog-post-client (BROWSE ile seç)
  Build Command: npm run build (otomatik doldurulur)
  Output Directory: dist (otomatik doldurulur)
  Install Command: npm install (otomatik doldurulur)
  ```

  **3.5. Environment Variables Ekle**
  ```
  "Environment Variables" sekmesine geç

  VITE_API_URL
  Value: https://blog-post-api-xxxxx.onrender.com/api

  VITE_GOOGLE_MAPS_API_KEY
  Value: your_google_maps_api_key
  ```

  **3.6. Deploy Et**
  ```
  1. "Deploy" butonuna tıkla
  2. Build başlayacak (2-3 dakika)
  3. Logs'u takip et:
     - "Installing dependencies..."
     - "Building..."
     - "Deployment completed"

  4. Deploy tamamlandığında:
     URL: https://blog-post-app-xxxxx.vercel.app
  ```

  **3.7. Frontend'i Test Et**
  ```
  1. Browser'da URL'i aç: https://blog-post-app-xxxxx.vercel.app
  2. Sayfanın açıldığını kontrol et
  3. Blog listesini kontrol et (backend'den veri geldiğini göreceksin)
  4. Category filter çalışıyor mu kontrol et
  5. Login/Signup test et
  ```

  ---

  ### ADIM 4: Custom Domain Bağlama (~$10/yıl)

  **4.1. Domain Satın Al (Cloudflare Registrar - Önerilen)**
  ```
  1. https://www.cloudflare.com/ adresine git
  2. Hesap oluştur veya giriş yap
  3. Sol menüden "Domain Registration" → "Register Domains"
  4. İstediğin domain'i ara (örn: myblog.com)
  5. Sepete ekle ve satın al
  6. Fiyat: ~$9-10/yıl (.com için)
  7. WHOIS privacy otomatik dahil
  ```

  **Alternatif Domain Sağlayıcıları:**
  - Porkbun: ~$10/yıl (kolay, WHOIS privacy dahil)
  - Namecheap: ~$13-15/yıl (ilk yıl indirimli)
  - GoDaddy: ❌ Pahalı, önerilmez

  **4.2. Cloudflare DNS Setup (Domain Cloudflare'den değilse)**
  ```
  Eğer domain'i başka yerden aldıysan (Porkbun, Namecheap vs):

  1. Cloudflare'de "Add a Site" → Domain adını gir
  2. Free plan seç
  3. Cloudflare sana 2 nameserver verecek:
     - ns1.cloudflare.com
     - ns2.cloudflare.com

  4. Domain sağlayıcının paneline git
  5. Nameserver ayarlarını Cloudflare'inki ile değiştir
  6. 24 saat içinde aktif olur (genelde 1-2 saat)
  ```

  **4.3. Frontend Domain Bağla (yourdomain.com)**
  ```
  VERCEL TARAFINDA:
  1. Vercel Dashboard → Your Project → "Settings"
  2. Sol menüden "Domains"
  3. "Add" butonuna tıkla
  4. Domain'ini gir: yourdomain.com
  5. "Add" butonuna tıkla
  6. Vercel sana DNS kayıtlarını gösterecek

  CLOUDFLARE TARAFINDA:
  1. Cloudflare Dashboard → Your Domain → "DNS"
  2. "Add record" butonuna tıkla

  Root domain için (yourdomain.com):
  Type: CNAME
  Name: @ (veya boş bırak)
  Target: cname.vercel-dns.com
  Proxy status: OFF (gri bulut) - Önemli!
  TTL: Auto

  3. "Save" butonuna tıkla

  4. www subdomain için tekrarla:
  Type: CNAME
  Name: www
  Target: cname.vercel-dns.com
  Proxy status: OFF

  5. "Save" butonuna tıkla

  VERCEL'DE DOĞRULAMA:
  1. 5-10 dakika bekle
  2. Vercel'de "Refresh" butonuna tıkla
  3. Domain'in yanında ✅ işareti görünecek
  4. SSL sertifikası otomatik oluşacak (5-10 dakika)
  ```

  **4.4. Backend Domain Bağla (api.yourdomain.com)**
  ```
  RENDER TARAFINDA:
  1. Render Dashboard → Your Service → "Settings"
  2. "Custom Domain" bölümünü bul
  3. "Add Custom Domain" butonuna tıkla
  4. Domain gir: api.yourdomain.com
  5. "Save" butonuna tıkla
  6. Render sana bir CNAME target gösterecek (örn: xxx.onrender.com)

  CLOUDFLARE TARAFINDA:
  1. Cloudflare Dashboard → Your Domain → "DNS"
  2. "Add record" butonuna tıkla

  Type: CNAME
  Name: api
  Target: blog-post-api-xxxxx.onrender.com (Render'dan aldığın)
  Proxy status: OFF (gri bulut) - Önemli!
  TTL: Auto

  3. "Save" butonuna tıkla

  RENDER'DA DOĞRULAMA:
  1. 5-10 dakika bekle
  2. Render Dashboard'da domain durumunu kontrol et
  3. "Verified" yazısını göreceksin
  4. SSL sertifikası otomatik oluşacak
  ```

  **4.5. Frontend .env Güncelle (API URL)**
  ```bash
  cd blog-post-client

  # .env dosyasını güncelle
  VITE_API_URL=https://api.yourdomain.com/api

  # Commit ve push et
  git add .
  git commit -m "Update API URL to custom domain"
  git push origin main

  # Vercel otomatik yeniden deploy edecek (1-2 dakika)
  ```

  **4.6. Cloudflare SSL/TLS Ayarları (Önemli!)**
  ```
  1. Cloudflare Dashboard → Your Domain → "SSL/TLS"
  2. Overview sekmesinde:
     Encryption mode: "Full" seç (veya "Full (strict)")

  3. Edge Certificates sekmesinde:
     - "Always Use HTTPS" → ON
     - "Automatic HTTPS Rewrites" → ON
  ```

  **4.7. Test Et**
  ```bash
  # Frontend test
  curl https://yourdomain.com
  curl https://www.yourdomain.com

  # Backend API test
  curl https://api.yourdomain.com
  curl https://api.yourdomain.com/api/blogs

  # Browser'da:
  1. https://yourdomain.com adresine git
  2. Kilid simgesine tıkla → SSL aktif olmalı
  3. Blog listesi yükleniyor mu kontrol et
  4. Login/Signup test et
  ```

  ---

  ### ADIM 5: Otomatik Deployment Setup

  **5.1. GitHub Actions (Opsiyonel)**
  ```yaml
  # .github/workflows/deploy.yml

  name: Deploy

  on:
    push:
      branches: [main]

  jobs:
    deploy:
      runs-on: ubuntu-latest
      steps:
        - name: Trigger Vercel Deploy
          run: echo "Vercel auto-deploys on push"

        - name: Trigger Render Deploy
          run: echo "Render auto-deploys on push"
  ```

  **5.2. Auto-Deploy Ayarları**
  ```
  VERCEL:
  - Default olarak aktif
  - Her git push'ta otomatik deploy
  - Pull request'ler için preview deploy

  RENDER:
  - Settings → "Build & Deploy"
  - "Auto-Deploy" → ON (default)
  - Her git push'ta otomatik deploy
  ```

  ---

  ### 🎉 TAMAMLANDI!

  **Artık şunlar çalışıyor:**
  - ✅ Frontend: https://yourdomain.com
  - ✅ Backend: https://api.yourdomain.com
  - ✅ Database: MongoDB Atlas (cloud)
  - ✅ SSL: Otomatik (her yerde)
  - ✅ Auto-Deploy: GitHub push → Otomatik deploy

  **Toplam Maliyet:**
  - Domain: ~$10/yıl
  - Hosting: $0/ay (ücretsiz tier)
  - **TOPLAM: ~$10/yıl**

  ---

  ### 🚨 Troubleshooting (Sorun Giderme)

  **Problem 1: Render'da "MongoServerError: Authentication failed"**
  ```
  Çözüm:
  1. MongoDB Atlas'ta user şifresini kontrol et
  2. Connection string'de özel karakterler varsa encode et
     Örn: p@ssw0rd → p%40ssw0rd (@ yerine %40)
  3. Network Access'te 0.0.0.0/0 IP'si ekli mi kontrol et
  ```

  **Problem 2: Render'da "Service Unavailable" / 503 Error**
  ```
  Çözüm:
  1. Render free tier'da servis 15 dakika inaktifken uyur
  2. İlk istek 30-60 saniye sürebilir (cold start)
  3. Servisin uyandığını logs'tan görebilirsin

  Kalıcı çözüm:
  - UptimeRobot (ücretsiz) kullan
  - Her 14 dakikada bir: https://api.yourdomain.com
  ```

  **Problem 3: Vercel'de "Build Failed"**
  ```
  Çözüm:
  1. Root Directory'nin doğru seçildiğini kontrol et: blog-post-client
  2. Environment variables eklenmiş mi kontrol et
  3. package.json'da build script var mı: "build": "vite build"
  4. Logs'u incele, eksik dependency var mı bak
  ```

  **Problem 4: "CORS Error" Frontend → Backend**
  ```
  Çözüm:
  1. blog-post-server/app.js'te CORS ayarlarını kontrol et
  2. allowedOrigins array'ine frontend URL'ini ekle:
     - http://localhost:3001 (development)
     - https://yourdomain.com (production)
     - https://blog-post-app-xxxxx.vercel.app (vercel subdomain)

  3. Git push et, Render otomatik yeniden deploy edecek
  ```

  **Problem 5: Custom Domain "Invalid Configuration"**
  ```
  Çözüm:
  1. DNS propagation'ı bekle (5-60 dakika)
  2. DNS kayıtlarını kontrol et:
     - dig yourdomain.com
     - nslookup api.yourdomain.com

  3. Cloudflare Proxy durumunu kontrol et:
     - Vercel/Render için Proxy OFF olmalı (gri bulut)

  4. SSL/TLS mode'u "Full" olmalı (Cloudflare'de)
  ```

  **Problem 6: Google Maps "For development purposes only"**
  ```
  Çözüm:
  1. Google Cloud Console → Billing Account ekle
  2. Maps JavaScript API'yi enable et
  3. API Key restrictions ayarla:
     - HTTP referrers: https://yourdomain.com/*
  4. Frontend .env'de VITE_GOOGLE_MAPS_API_KEY doğru mu kontrol et
  5. Vercel'de environment variable ekli mi kontrol et
  ```

  **Problem 7: MongoDB Atlas "IP Not Whitelisted"**
  ```
  Çözüm:
  1. MongoDB Atlas → Network Access
  2. "Add IP Address" → "Allow Access from Anywhere" (0.0.0.0/0)
  3. Veya Render'ın outbound IP'lerini ekle (daha güvenli)
  ```

  **Problem 8: Backend'de "JWT Error" / Token Invalid**
  ```
  Çözüm:
  1. JWT_SECRET değişkenini kontrol et (Render'da)
  2. Frontend'de localStorage.clear() yap, yeniden login ol
  3. Token expiration süresini kontrol et (backend: 3 gün)
  ```

  ---

  ### 📊 Performans Optimizasyonu (Opsiyonel)

  **Frontend (Vercel):**
  ```
  - Otomatik CDN (global)
  - Edge caching aktif
  - Brotli compression
  - Image optimization (next/image kullanırsan)
  ```

  **Backend (Render):**
  ```
  - Frankfurt datacenter (Europe)
  - Free tier: Shared CPU, 512MB RAM
  - Cold start: 30-60 saniye
  - Upgrade: $7/ay (dedicated instance, no cold start)
  ```

  **Database (MongoDB Atlas):**
  ```
  - Free tier: M0 (512MB)
  - Shared cluster
  - Auto-scaling yok
  - Upgrade: $9/ay (M2, 2GB, dedicated)
  ```

  **Cloudflare (Ücretsiz):**
  ```
  - CDN: 200+ veri merkezi
  - DDoS protection
  - SSL/TLS
  - Cache rules (opsiyonel)
  ```

  ---

  ### 🔄 Güncellemeler ve Bakım

  **Kod Güncellemesi:**
  ```bash
  # Local'de değişiklik yap
  git add .
  git commit -m "Update feature"
  git push origin main

  # Otomatik deploy:
  # - Vercel: 1-2 dakika
  # - Render: 5-10 dakika
  ```

  **Database Backup (Önemli!):**
  ```
  MongoDB Atlas:
  1. Database → Clusters → ... → "Download Snapshot"
  2. Otomatik backup: Free tier'da YOK
  3. Manual export: MongoDB Compass kullan
  4. Haftada bir export al, güvenli yerde sakla
  ```

  **Monitoring:**
  ```
  Vercel:
  - Analytics: Dashboard'da mevcut
  - Logs: Realtime logs
  - Alerts: Email bildirimleri

  Render:
  - Logs: Dashboard'da mevcut
  - Metrics: CPU, Memory, Network
  - Alerts: Discord/Slack entegrasyonu

  MongoDB Atlas:
  - Monitoring: Dashboard'da mevcut
  - Alerts: Email/SMS
  - Query Analytics
  ```

  ---

  ### 💡 Pro Tips

  **1. Environment Variables Yönetimi:**
  ```bash
  # Local development
  .env (git'e commitlenmesin!)

  # Production
  Vercel Dashboard → Environment Variables
  Render Dashboard → Environment Variables

  # Değişiklik sonrası:
  - Vercel: Redeploy et
  - Render: Otomatik restart
  ```

  **2. Logs İzleme:**
  ```bash
  # Render logs (realtime)
  Render Dashboard → Service → Logs

  # Vercel logs (realtime)
  Vercel Dashboard → Project → Deployments → Latest → Logs

  # MongoDB logs
  Atlas Dashboard → Clusters → Monitoring
  ```

  **3. Cost Optimization:**
  ```
  - Render free tier: 750 saat/ay (31 gün = 744 saat)
    → Tek servis çalıştırmak için tam yeterli

  - MongoDB free tier: 512MB
    → ~10,000 blog için yeterli

  - Vercel free tier: 100GB bandwidth/ay
    → ~1,000,000 sayfa görüntüleme
  ```

  **4. Güvenlik:**
  ```
  - Environment variables'ları asla git'e commit etme
  - JWT_SECRET'ı güçlü ve rastgele oluştur
  - MongoDB password'ü güçlü oluştur
  - CORS ayarlarını production URL'leri ile kısıtla
  - API rate limiting ekle (express-rate-limit)
  ```

  ---

  ## 📚 Alternatif Deployment Seçenekleri

  **⚠️ ÖNEMLİ NOT - Local MongoDB Kullanımı:**

  Proje artık local MongoDB kullanıyor (localhost:27017). Production deployment'a geçmeden önce:
  1. MongoDB Atlas (cloud) veya production MongoDB instance'ı ayarlayın
  2. `blog-post-server/.env` dosyasındaki `MONGO_URI`'ı production URI ile güncelleyin
  3. Cloud MongoDB credential'ları `.env` dosyasında yorum satırında saklanmıştır

  **Local Development:**
  - Database: mongodb://localhost:27017/blog-post
  - MongoDB'nin çalıştığından emin olun: `pgrep -l mongod`
  - Backend port: 3000
  - Frontend port: 3001

  ---

  1. Railway (Önerilen - Fullstack için)

  Avantajlar:
  - Frontend ve backend'i aynı platformda yönetebilirsiniz
  - Otomatik SSL sertifikası (Let's Encrypt)
  - GitHub entegrasyonu ile otomatik deployment
  - PostgreSQL, Redis gibi servisleri kolayca ekleyebilirsiniz
  - Ücretsiz tier'da $5 kredi/ay

  Kurulum:
  # Railway CLI kurulumu
  npm i -g @railway/cli

  # Login
  railway login

  # Backend deploy
  cd backend && railway init
  railway up

  # Frontend deploy (static olarak veya Node.js sunucu ile)
  cd frontend && railway init
  railway up

  2. Render (Alternatif - Güvenilir ve Kolay)

  Avantajlar:
  - Ücretsiz tier (sınırlı)
  - Otomatik SSL
  - Çok kolay arayüz
  - Static site + Web service kombinasyonu

  Yapılandırma:
  - Frontend: Static Site olarak deploy
  - Backend: Web Service olarak deploy
  - Custom domain'i Render dashboard'dan ekleyin

  3. Vercel (Frontend) + Railway/Render (Backend)

  En Popüler Kombinasyon:
  - Frontend için Vercel (en hızlı CDN)
  - Backend için Railway veya Render
  - Her ikisi de otomatik SSL

  4. Traditional VPS (Tam Kontrol İstiyorsanız)

  Platform: DigitalOcean, Hetzner, Linode

  Kurulum Adımları:
  # 1. VPS'e bağlan
  ssh root@your-server-ip

  # 2. Node.js kurulumu
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt-get install -y nodejs

  # 3. Nginx kurulumu
  sudo apt install nginx

  # 4. PM2 ile backend'i çalıştır
  npm install -g pm2
  cd /var/www/backend
  pm2 start npm --name "backend" -- start
  pm2 startup
  pm2 save

  # 5. Frontend build'i Nginx'e kopyala
  cd /var/www/frontend
  yarn build
  sudo cp -r dist/* /var/www/html/

  # 6. Certbot ile SSL
  sudo apt install certbot python3-certbot-nginx
  sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

  Nginx Konfigürasyonu:
  # /etc/nginx/sites-available/yoursite
  server {
      listen 80;
      server_name yourdomain.com www.yourdomain.com;

      # Frontend
      location / {
          root /var/www/html;
          try_files $uri $uri/ /index.html;
      }

      # Backend API
      location /api {
          proxy_pass http://localhost:3000;
          proxy_http_version 1.1;
          proxy_set_header Upgrade $http_upgrade;
          proxy_set_header Connection 'upgrade';
          proxy_set_header Host $host;
          proxy_cache_bypass $http_upgrade;
      }
  }

  Domain ve SSL Yapılandırması

  Railway/Render/Vercel için:

  1. Dashboard'dan "Custom Domain" seçeneğine gidin
  2. Domain'inizi ekleyin (örn: yourdomain.com)
  3. DNS kayıtlarını güncelleyin:
    - A Record: Platform'un verdiği IP'ye
    - CNAME: Platform'un verdiği URL'ye (örn: your-app.up.railway.app)
  4. SSL otomatik olarak yapılandırılır (5-10 dakika)

  Cloudflare ile (Ekstra Güvenlik ve CDN):

  1. Domain'inizi Cloudflare'e ekleyin
  2. Nameserver'ları değiştirin
  3. DNS kayıtlarını ekleyin
  4. SSL/TLS modunu "Full" yapın
  5. Ücretsiz CDN, DDoS koruması ve WAF kazanın

  Proje Yapınıza Göre Önerim

  Mevcut Flexytime-Fe projeniz için:

  Frontend (Vue.js):
  - Vercel veya Netlify - En hızlı ve kolay
  - Build command: yarn build
  - Output directory: dist

  Backend (Node.js):
  - Railway veya Render
  - Otomatik deployment için GitHub'a push yeterli

  Maliyet:
  - Vercel + Railway: Başlangıç için ücretsiz, sonra ~$10-20/ay
  - VPS: ~$5-10/ay (Hetzner), daha fazla yönetim gerektirir

  Hangi yaklaşımı tercih edersiniz? Buna göre detaylı adımları verebilirim.

> domain'i nasıl bağlıyoruz bu durumda, nerden domain almalıyım? bir de bunun daha ucuz bir yolu var mı? 

⏺ Domain Nasıl Alınır ve Bağlanır?

  Domain Satın Alma

  En Popüler Domain Sağlayıcıları:

  1. Cloudflare Registrar (En Ucuz - Önerilen)
  - Fiyat: ~$9-10/yıl (.com için)
  - Artı: Markup yok, sadece maliyet fiyatı
  - Artı: Ücretsiz WHOIS gizliliği
  - Artı: Cloudflare DNS ve CDN dahil
  - Eksi: Cloudflare hesabı gerekli
  - 🔗 https://www.cloudflare.com/products/registrar/

  2. Porkbun (Ucuz ve Kolay)
  - Fiyat: ~$10/yıl (.com için)
  - Artı: Ücretsiz WHOIS gizliliği
  - Artı: Kolay arayüz
  - 🔗 https://porkbun.com/

  3. Namecheap
  - Fiyat: ~$13-15/yıl (.com için)
  - Artı: İlk yıl indirimli (~$8)
  - Artı: Kolay kullanım
  - 🔗 https://www.namecheap.com/

  4. GoDaddy (Popüler ama pahalı)
  - Fiyat: ~$20/yıl
  - Eksi: Yenileme fiyatları yüksek
  - ❌ Önerilmez

  Daha Ucuz Alternatifler

  Ücretsiz Domain Seçenekleri:

  1. Freenom (.tk, .ml, .ga, .cf, .gq)
  - Tamamen ücretsiz
  - ⚠️ Profesyonel değil, test için uygun
  - ⚠️ SEO için kötü, spam olarak işaretlenebilir

  2. Platform Subdomain'leri (Ücretsiz)
  - Vercel: yourapp.vercel.app
  - Railway: yourapp.up.railway.app
  - Netlify: yourapp.netlify.app
  - ✅ SSL dahil, hemen kullanıma hazır
  - ⚠️ Profesyonel olmayan görünüm

  Ucuz Domain Uzantıları:

  - .xyz → ~$2-3/yıl
  - .online → ~$3-4/yıl
  - .site → ~$3-4/yıl
  - .tech → ~$5-6/yıl
  - .dev → ~$12/yıl (güvenli, geliştiriciler için)

  Önerim: İlk başta platform subdomain'i kullanın, proje büyüyünce .com alın.

  ---
  Domain'i Deployment Platformuna Bağlama

  Vercel'e Domain Bağlama

  1. Domain Aldıktan Sonra:
  # Vercel'de projenize gidin
  1. Dashboard → Your Project → Settings → Domains
  2. "Add Domain" butonuna tıklayın
  3. Domain'inizi girin (örn: yourdomain.com)

  2. DNS Kayıtlarını Güncelleyin:

  Cloudflare/Porkbun/Namecheap DNS yönetimine gidin:

  A Record (Root domain için):
  Type: A
  Name: @ (veya boş)
  Value: 76.76.21.21 (Vercel IP)

  CNAME Record (www için):
  Type: CNAME
  Name: www
  Value: cname.vercel-dns.com

  3. SSL Otomatik Aktif Olur (5-10 dakika)

  ---
  Railway'e Domain Bağlama

  1. Railway Dashboard:
  1. Project → Settings → Domains
  2. "Custom Domain" ekleyin
  3. yourdomain.com girin

  2. DNS Kayıtları:
  Type: CNAME
  Name: @ (veya subdomain)
  Value: your-app.up.railway.app

  Not: Root domain (@) için CNAME kullanamıyorsanız:
  Type: A
  Name: @
  Value: Railway'in verdiği IP

  ---
  Cloudflare ile Bağlama (Ekstra Özellikler)

  Cloudflare'den domain alırsanız veya nameserver'ları Cloudflare'e yönlendirirseniz:

  Avantajlar:
  - ✅ Ücretsiz CDN
  - ✅ Ücretsiz DDoS koruması
  - ✅ Ücretsiz SSL
  - ✅ Cache yönetimi
  - ✅ Analytics

  Kurulum:
  1. Cloudflare'de domain ekleyin
  2. Nameserver'ları domain sağlayıcınızda değiştirin
     - Cloudflare size 2 nameserver verir
     - Örn: ns1.cloudflare.com, ns2.cloudflare.com
  3. DNS kayıtlarını Cloudflare'de ekleyin

  Cloudflare DNS Ayarları:
  Type: CNAME
  Name: @
  Value: your-app.vercel.app
  Proxy status: Proxied (turuncu bulut)

  Type: CNAME
  Name: www
  Value: your-app.vercel.app
  Proxy status: Proxied

  SSL/TLS Ayarı:
  - Cloudflare → SSL/TLS → Overview
  - Encryption mode: "Full" veya "Full (strict)"

  ---
  Tam Maliyetler ve Karşılaştırma

  Senaryo 1: Minimum Maliyet

  - Domain: Cloudflare Registrar - $10/yıl
  - Frontend: Vercel Free Tier - $0
  - Backend: Railway Free Tier - $0 (5$ kredi/ay)
  - SSL: Ücretsiz (otomatik)
  - CDN: Cloudflare - $0
  - TOPLAM: ~$10/yıl (sadece domain)

  Senaryo 2: Test/Hobi Projesi

  - Domain: Platform subdomain - $0
  - Frontend: Vercel - $0
  - Backend: Railway - $0
  - TOPLAM: $0

  Senaryo 3: Profesyonel

  - Domain: Cloudflare .com - $10/yıl
  - Frontend: Vercel Pro - $20/ay
  - Backend: Railway Hobby - $5/ay
  - Database: Railway'e dahil
  - TOPLAM: ~$25/ay + $10 domain

  ---
  Adım Adım Pratik Kurulum (En Ucuz Yol)

  1. İlk Aşama (Ücretsiz Test)

  # Frontend deploy
  vercel --prod

  # Backend deploy
  railway up

  # Sonuç:
  # Frontend: yourapp.vercel.app
  # Backend: yourapp.up.railway.app
  # Maliyet: $0

  2. Domain Ekleme

  # Cloudflare'den domain alın: $10/yıl
  1. cloudflare.com/products/registrar
  2. Domain arayın ve satın alın
  3. Cloudflare DNS otomatik aktif olur

  3. DNS Bağlama

  # Cloudflare DNS panel
  1. Add Record
     Type: CNAME
     Name: @
     Target: yourapp.vercel.app
     Proxy: ON (turuncu bulut)

  2. Add Record
     Type: CNAME
     Name: www
     Target: yourapp.vercel.app
     Proxy: ON

  3. Add Record
     Type: CNAME
     Name: api
     Target: yourapp.up.railway.app
     Proxy: ON

  4. Vercel'de Domain Doğrulama

  # Vercel dashboard
  1. Project Settings → Domains
  2. Add: yourdomain.com
  3. Add: www.yourdomain.com
  4. Bekleyin (5-10 dakika)
  5. SSL otomatik aktif olur

  ---
  Bonus: Backend API için Subdomain

  Backend'inizi api.yourdomain.com gibi bir subdomain'de çalıştırabilirsiniz:

  # Cloudflare DNS
  Type: CNAME
  Name: api
  Value: yourapp.up.railway.app
  Proxy: ON

  # Frontend .env dosyanızda
  VITE_API_URL=https://api.yourdomain.com

  ---
  Özet Öneri

  Şu an için:
  1. Platform subdomain'leriyle başlayın (ücretsiz)
  2. Proje test edilsin, çalışsın

  Profesyonelleşince:
  1. Cloudflare'den domain alın (~$10/yıl)
  2. Vercel + Railway kombinasyonuyla devam edin
  3. Cloudflare DNS ve CDN kullanın

  Toplam maliyet: İlk 1 yıl $0, sonra $10/yıl (sadece domain)

  Başka soru varsa sormaktan çekinmeyin! 🚀