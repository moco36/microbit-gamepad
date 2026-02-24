//% color="#AA278D" icon="\uf11b"
namespace gamepad {

    let _buf: Buffer = null
    let _address: number = 0x42

    /**
     * @param addr I2C address, eg: 0x42
     */
    //% block="Set gamepad I2C address to %addr"
    //% weight=110
    export function setAddress(addr: number): void {
        _address = addr
    }

    //% block="Load gamepad"
    //% weight=100
    export function update(): void {
        _buf = pins.i2cReadBuffer(_address, 8, false)
    }

    /**
     * @param btn Button number (1-13), eg: 1
     */
    //% block="Button %btn is pressed"
    //% btn.min=1 btn.max=13
    //% weight=90
    export function isButtonPressed(btn: number): boolean {
        if (!_buf) return false
        if (btn >= 1 && btn <= 8) {
            return ((_buf.getNumber(NumberFormat.UInt8LE, 5) >> (btn - 1)) & 1) === 1
        } else if (btn >= 9 && btn <= 13) {
            return ((_buf.getNumber(NumberFormat.UInt8LE, 6) >> (btn - 9)) & 1) === 1
        }
        return false
    }

    //% block="Stick %axis value"
    //% weight=80
    export function getAxis(axis: Axis): number {
        if (!_buf) return 128
        return _buf.getNumber(NumberFormat.UInt8LE, axis as number)
    }

    //% block="Hat switch pressed %dir"
    //% weight=70
    export function isHatPressed(dir: HatDirection): boolean {
        if (!_buf) return false
        const hat = _buf.getNumber(NumberFormat.UInt8LE, 4)
        if (dir === HatDirection.Neutral) return hat > 7
        return hat === (dir as number)
    }

    //% block="Hat switch raw value"
    //% weight=60
    export function getHatRaw(): number {
        if (!_buf) return 15
        return _buf.getNumber(NumberFormat.UInt8LE, 4)
    }

    export enum Axis {
        //% block="Left X"
        LX = 0,
        //% block="Left Y"
        LY = 1,
        //% block="Right X"
        RX = 2,
        //% block="Right Y"
        RY = 3
    }

    export enum HatDirection {
        //% block="Up"
        Up,
        //% block="Up-Right"
        UpRight,
        //% block="Right"
        Right,
        //% block="Down-Right"
        DownRight,
        //% block="Down"
        Down,
        //% block="Down-Left"
        DownLeft,
        //% block="Left"
        Left,
        //% block="Up-Left"
        UpLeft,
        //% block="Neutral"
        Neutral
    }
}
