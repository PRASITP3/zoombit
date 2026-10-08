# autobot — Cytron ZOOM:BIT หุ่นยนต์เดินเองหลบสิ่งกีดขวาง

โค้ด MakeCode (JavaScript/TypeScript) สำหรับ micro:bit + Cytron ZOOM:BIT

## การทำงาน
- กด **A** เปิด/ปิดโหมดเดินเอง, กด **B** หยุดฉุกเฉิน
- วิ่งหน้าจนอัลตราโซนิกเจอของใกล้กว่า `STOP_CM`
- ถอยนิด → servo หันหัวสแกน 5 ทิศ → หมุนตัวรถไปทิศที่โล่งสุด (ตันทุกทิศ = กลับหลังหัน)

## ค่าที่ต้องจูน (บนสุดของ `main.ts`)
| ค่า | ความหมาย |
|---|---|
| `SERVO` | ช่องที่เสียบ servo บน REKA:BIT (S1/S2) |
| `CENTER` | มุม servo ที่หัวมองตรงหน้า |
| `TURN_45_MS` | เวลาหมุนตัวรถให้ได้ ~45 องศา |
| `STOP_CM` | ระยะเริ่มหลบ (cm) |
| `SPEED` | ความเร็วมอเตอร์ 0-255 |

## วิธีใช้ใน MakeCode
1. เปิด https://makecode.microbit.org สร้างโปรเจกต์ใหม่
2. Extensions → ค้น `zoombit` → เพิ่ม
3. สลับเป็นแท็บ JavaScript, Ctrl+A แล้ววาง `main.ts` ทั้งไฟล์
4. Download ลง micro:bit

หรือ Import จาก GitHub ด้วย URL ของ repo นี้ได้โดยตรง
