


**

# Weather Forecast API (NestJS)

โปรเจกต์นี้คือ Backend API สำหรับระบบพยากรณ์อากาศที่พัฒนาด้วย NestJS และ TypeScript โดยใช้ Prisma ORM ในการเชื่อมต่อกับฐานข้อมูล MySQL มีระบบยืนยันตัวตน (Authentication) ด้วย JWT และจัดการข้อมูลผู้ใช้, เมือง, การสมัครรับข้อมูลสภาพอากาศ และการดึงข้อมูลสภาพอากาศจาก External API


## คุณสมบัติหลัก (Features)
 - ### Authentication & Authorization:
	 - ลงทะเบียน (Register) ผู้ใช้ใหม่
	 
	 - เข้าสู่ระบบ (Login) ด้วยอีเมลและรหัสผ่าน
	    
	 - รีเฟรช Access Token ด้วย Refresh Token
	 
	 - ใช้ JWT (HS256) สำหรับการยืนยันตัวตน
	       
	 - Access Token มีอายุ 15 นาที, Refresh Token มีอายุ 7 วัน
	 
	 - การ Hash รหัสผ่านด้วย Bcrypt (อย่างน้อย 10 Salt Rounds)
	 
 - ### User Management:

	 - สร้างผู้ใช้

	- ดึงข้อมูลผู้ใช้ทั้งหมด (พร้อม Pagination)

	- ดึงข้อมูลโปรไฟล์ผู้ใช้ปัจจุบัน

	- ดึงข้อมูลผู้ใช้ตาม ID

	- อัปเดตข้อมูลผู้ใช้

	- ลบผู้ใช้

 - ### City Management:


	- สร้างเมืองใหม่

	- ดึงข้อมูลเมืองทั้งหมด (พร้อม Pagination)

	- ดึงข้อมูลเมืองตาม ID

	- อัปเดตข้อมูลเมือง

	- ลบเมือง

	- Subscription Management:

	- สมัครรับข้อมูลสภาพอากาศของเมืองที่สนใจ

	- ดูรายการเมืองที่ผู้ใช้ปัจจุบันสมัครรับข้อมูล

	- ยกเลิกการสมัครรับข้อมูลสภาพอากาศ

 - ### Weather Data:

	- ดึงข้อมูลสภาพอากาศปัจจุบันสำหรับเมืองที่ระบุ (ใช้ WeatherAPI.com)

	- มีระบบ Cache ข้อมูลสภาพอากาศเพื่อลดการเรียก External API ซ้ำซ้อน

 - ### API Documentation:

	- Swagger (OpenAPI 3) Auto-generated ด้วย @nestjs/swagger

 - ### Validation & Error Handling:

	- ใช้ ```class-validator``` สำหรับการตรวจสอบความถูกต้องของข้อมูล DTO

	- จัดการข้อผิดพลาดด้วย NestJS Common Exceptions (เช่น ```NotFoundException```,``` ConflictException```, ```UnauthorizedException```)

 - ### Security Enhancements:

	- **Rate Limiting**: จำกัดจำนวน Request เพื่อป้องกันการโจมตีแบบ Brute-force หรือ DoS (ตั้งค่าเริ่มต้น 100 requests/นาที)

	- **Helmet**: ตั้งค่า HTTP Headers ต่างๆ เพื่อเพิ่มความปลอดภัยของแอปพลิเคชัน

 - ### เทคโนโลยีที่ใช้ (Technologies Used)
	- **Backend Framework**: NestJS

	- **Language**: TypeScript

	- **ORM**: Prisma

	- **Database**: MySQL

	- **Authentication**: JWT (JSON Web Tokens), Bcrypt

	- **API Documentation**: Swagger (@nestjs/swagger)

	- **Validation**: class-validator, class-transformer

	- **HTTP Client**: @nestjs/axios

	- **Security**: @nestjs/throttler (Rate Limiting), helmet

	- **Containerization**: Docker, Docker Compose

 ### โครงสร้างโปรเจกต์ (Project Structure)
โปรเจกต์นี้ถูกจัดโครงสร้างในรูปแบบ Modular เพื่อความสะอาดและง่ายต่อการจัดการ:
```
src/
├── module/
│   ├── Auth APIs/             # โมดูลสำหรับ Authentication และ Authorization
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── strategies/
│   │   ├── auth.controller.ts
│   │   ├── auth.module.ts
│   │   └── auth.service.ts
│   ├── City APIs/             # โมดูลสำหรับจัดการข้อมูลเมือง
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── city.controller.ts
│   │   ├── city.module.ts
│   │   └── city.service.ts
│   ├── prisma/                # โมดูลสำหรับ PrismaService (เชื่อมต่อฐานข้อมูล)
│   │   ├── prisma.module.ts
│   │   └── prisma.service.ts
│   ├── Subscriptions APIs/    # โมดูลสำหรับจัดการการสมัครรับข้อมูลสภาพอากาศ
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── Sub.controller.ts
│   │   ├── Sub.module.ts
│   │   └── Sub.service.ts
│   ├── User APIs/             # โมดูลสำหรับจัดการข้อมูลผู้ใช้
│   │   ├── dto/
│   │   ├── entity/
│   │   ├── user.controller.ts
│   │   ├── user.module.ts
│   │   └── user.service.ts
│   └── Weather APIs/          # โมดูลสำหรับดึงข้อมูลสภาพอากาศ
│       ├── dto/
│       ├── weather.controller.ts
│       ├── weather.module.ts
│       └── weather.service.ts
├── app.module.ts              # Root Module ของแอปพลิเคชัน
└── main.ts                    # Entry point ของแอปพลิเคชัน
prisma/                        # โฟลเดอร์สำหรับ Prisma Schema และ Migrations
├── migrations/
└── schema.prisma
.env                           # ไฟล์สำหรับ Environment Variables
.dockerignore                  # ไฟล์สำหรับบอก Docker ว่าไฟล์/โฟลเดอร์ใดไม่ควรรวมใน Image
Dockerfile                     # ไฟล์สำหรับสร้าง Docker Image ของ NestJS API
docker-compose.yml             # ไฟล์สำหรับกำหนดและรันหลาย Docker Container (API + DB)
package.json                   # ข้อมูลโปรเจกต์และ Dependencies
```
 ### การติดตั้งและการรัน (Setup and Running)
**ข้อกำหนดเบื้องต้น (Prerequisites)**

 - Node.js (v18 หรือสูงกว่า)

 - npm 

 - Docker Desktop (รวม Docker Engine และ Docker Compose)

**1. การเตรียมโปรเจกต์**
- **ติดตั้ง Dependencies:**
เปิด Terminal ใน Root Directory ของโปรเจกต์ และรันคำสั่ง:
```
npm install
```
- **ตั้งค่า Environment Variables:**
สร้างไฟล์ ```.env ```ใน Root Directory ของโปรเจกต์ และเพิ่มค่า Environment Variables ที่จำเป็น:
```
DATABASE_URL="mysql://user:password@db:3306/database"
JWT_SECRET="secret_key"
WEATHERAPI_API_KEY="WeatherAPI_Key"
```
- ```DATABASE_URL:``` URL  การเชื่อมต่อฐานข้อมูล MySQL (ภายใน Docker Network)

- ```JWT_SECRET```: Secret Key ที่ใช้ในการ Sign และ Verify JWT 

- ```WEATHERAPI_API_KEY```: API Key จาก WeatherAPI.com สำหรับดึงข้อมูลสภาพอากาศ

- **ตั้งค่า .dockerignore:**
สร้างหรือแก้ไขไฟล์ชื่อ``` .dockerignore``` ที่ Root Directory ของโปรเจกต์ และเพิ่มบรรทัด``` .env``` ลงไป เพื่อป้องกันไม่ให้ไฟล์``` .env``` บนเครื่อง Host ถูกคัดลอกเข้าไปใน Docker Image:
```
node_modules/
dist/
.env
.git/
Dockerfile
docker-compose.yml
npm-debug.log
```
- **ตรวจสอบ ```Dockerfile```:**
ตรวจสอบให้แน่ใจว่า ```Dockerfile ```ของมีการรัน``` npx prisma generate``` ก่อน``` npm run build ```เพื่อให้ Prisma Client ถูกสร้างขึ้นภายใน Docker Image:
```
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate # 
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/main"]
```
- **ตรวจสอบ docker-compose.yml:**
ตรวจสอบว่า docker-compose.yml มีการตั้งค่าพอร์ตและ Environment Variables ที่ถูกต้องสำหรับ api และ db services:
```
version: '3.8'
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: mysql://user:password@db:3306/database #
      JWT_SECRET: secret_key
      WEATHERAPI_API_KEY: weatherAPI_key
      NODE_ENV: development
    depends_on:
      - db
    restart: always

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: database
MYSQL_ROOT_PASSWORD
    ports:
      - "3308:3306" #
    volumes:
      - db-data:/var/lib/mysql
    restart: always

volumes:
  db-data:
```
**2. การรันแอปพลิเคชันด้วย Docker Compose**
- **หยุดและลบ Docker Container และ Volume เก่าทั้งหมด:**
เปิด Terminal ใน Root Directory ของโปรเจกต์ และรันคำสั่ง:

	```docker-compose down -v```

- คำสั่งนี้จะหยุดและลบ Container, Network และ Volume ที่เชื่อมโยงกับโปรเจกต์ Docker Compose  การใช้ ```-v``` สำคัญมากหากต้องการล้างข้อมูลฐานข้อมูลเก่าออกไป

- **Build Docker Image ใหม่ทั้งหมด:**
รันคำสั่งนี้:

	``` docker-compose build ``` 


- **รัน Docker Container ทั้งหมดในพื้นหลัง:**
หลังจาก Build สำเร็จ ให้รันคำสั่งนี้:

	```docker-compose up -d```

คำสั่งนี้จะเริ่มต้น Container ของ api (NestJS) และ db (MySQL) ในโหมด Detached (ทำงานในพื้นหลัง)

- **รอให้ ```db ```service พร้อม  และรัน Prisma Migrations:**

- หลังจากรัน``` docker-compose up -d```แล้ว ให้รอประมาณ 20-30 วินาที เพื่อให้ MySQL Container มีเวลาเริ่มต้นและอยู่ในสถานะที่พร้อมใช้งาน

- สามารถตรวจสอบสถานะของ Container ได้ด้วยคำสั่ง:

	```docker-compose ps```

	ควรจะเห็น``` db``` service และ``` api``` service อยู่ในสถานะ Up

- เมื่อ ```api``` service อยู่ในสถานะ ```Up``` แล้ว ค่อยรันคำสั่ง Prisma Migrations เพื่อสร้างตารางในฐานข้อมูล:

	```docker-compose exec api npx prisma migrate dev --name initial_setup```

- Prisma อาจจะถามชื่อ Migration ให้พิมพ์ชื่ออะไรก็ได้ เช่น initial_setup แล้วกด Enter

**เอกสาร API (Swagger)**
เมื่อแอปพลิเคชันกำลังทำงานอยู่สามารถเข้าถึงเอกสาร API ที่สร้างโดย Swagger ได้ที่:

http://localhost:3000/api

คุณสามารถใช้ Swagger UI เพื่อทดสอบ API Endpoints ต่างๆ ได้โดยตรง
