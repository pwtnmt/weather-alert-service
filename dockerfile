# ใช้ Node.js 18 เป็น Base Image (แนะนำให้ใช้ Alpine เพื่อขนาดที่เล็ก)
FROM node:18-alpine

# กำหนด working directory ภายใน container
WORKDIR /app

# คัดลอก package.json และ package-lock.json (ถ้ามี) เพื่อติดตั้ง dependencies
# การทำแบบนี้จะช่วยให้ layer นี้ถูก cache ไว้ ถ้า dependencies ไม่มีการเปลี่ยนแปลง
COPY package*.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์และโฟลเดอร์ที่เหลือทั้งหมดจาก host ไปยัง working directory ใน container
COPY . .

# **สำคัญ:** รัน npx prisma generate เพื่อสร้าง Prisma Client และ Type Definitions
# ต้องรันก่อน npm run build
RUN npx prisma generate

# สร้าง production build ของแอปพลิเคชัน NestJS
# ตรวจสอบให้แน่ใจว่าใน package.json มี script "build" ที่คอมไพล์โค้ด
RUN npm run build

# เปิดพอร์ตที่แอปพลิเคชัน NestJS จะรัน (โดยทั่วไปคือ 3000)
EXPOSE 3000

# กำหนดคำสั่งที่จะรันเมื่อ container เริ่มต้น
# โดยปกติ NestJS จะรันไฟล์ main.js ที่ถูกคอมไพล์แล้วในโฟลเดอร์ dist
CMD ["node", "dist/main"]
