// ===== ตั้งค่า =====
const SPEED = 128
const STOP_CM = 20
const SERVO = ServoChannel.S1   // ถ้าเสียบที่ S2 ให้แก้ตรงนี้
const CENTER = 90               // มุมที่หัวมองตรงหน้า จูนได้ถ้าเอียง
const TURN_45_MS = 300          // เวลาหมุนตัวรถ ~45 องศา ต้องจูน
let autoMode = false

input.onButtonPressed(Button.A, function () {
    autoMode = !autoMode
    if (autoMode) {
        basic.showIcon(IconNames.Yes)
    } else {
        zoombit.brake()
        basic.showIcon(IconNames.No)
    }
})
input.onButtonPressed(Button.B, function () {
    autoMode = false
    zoombit.brake()
    basic.showIcon(IconNames.No)
})

// อ่าน 3 ครั้งเอาค่ากลาง (0 = ไกลเกินช่วง ถือว่า 400)
function readDistance(): number {
    let a = zoombit.readUltrasonic()
    let b = zoombit.readUltrasonic()
    let c = zoombit.readUltrasonic()
    if (a == 0) a = 400
    if (b == 0) b = 400
    if (c == 0) c = 400
    return Math.max(Math.min(a, b), Math.min(Math.max(a, b), c))
}

// หันหัวไปมุมที่กำหนด รอให้ servo ถึง แล้ววัด
function lookAt(angle: number): number {
    rekabit.setServoPosition(SERVO, angle)
    basic.pause(250)
    return readDistance()
}

function turnFor(dir: TurnDirection, ms: number) {
    zoombit.turn(dir, SPEED)
    basic.pause(ms)
    zoombit.brake()
    basic.pause(100)
}

function avoidObstacle() {
    basic.showIcon(IconNames.Sad)
    zoombit.brake()
    zoombit.move(MotorDirection.Backward, SPEED)
    basic.pause(350)
    zoombit.brake()

    // สแกน 5 ทิศ: offset จากกึ่งกลาง -80, -40, 0, +40, +80
    let offsets = [-80, -40, 0, 40, 80]
    let best = 0
    let bestDist = -1
    for (let i = 0; i < offsets.length; i++) {
        let d = lookAt(CENTER + offsets[i])
        if (d > bestDist) {
            bestDist = d
            best = offsets[i]
        }
    }
    rekabit.setServoPosition(SERVO, CENTER)   // หันหัวกลับตรงหน้า

    if (bestDist < STOP_CM) {
        // ตันทุกทิศ กลับหลังหัน
        basic.showArrow(ArrowNames.South)
        turnFor(TurnDirection.Right, TURN_45_MS * 4)
    } else if (best < 0) {
        // ซ้ายโล่ง (servo มุมน้อย = ซ้าย ถ้ากลับด้านให้สลับ Left/Right)
        basic.showArrow(ArrowNames.West)
        turnFor(TurnDirection.Left, TURN_45_MS * Math.abs(best) / 40)
    } else if (best > 0) {
        basic.showArrow(ArrowNames.East)
        turnFor(TurnDirection.Right, TURN_45_MS * best / 40)
    }
    basic.showIcon(IconNames.Yes)
}

basic.forever(function () {
    if (!autoMode) {
        basic.pause(100)
        return
    }
    if (readDistance() >= STOP_CM) {
        zoombit.move(MotorDirection.Forward, SPEED)
    } else {
        avoidObstacle()
    }
    basic.pause(50)
})

rekabit.setServoPosition(SERVO, CENTER)
basic.showIcon(IconNames.No)
