//% color="#AA278D" icon="\uf11b" block="ゲームパッド"
namespace gamepad {

    let _buf: Buffer = null
    let _address: number = 0x42

    /**
     * I2Cアドレスを設定する（デフォルト: 0x42）
     * @param addr I2Cアドレス, eg: 0x42
     */
    //% block="ゲームパッドのI2Cアドレスを %addr に設定する"
    //% weight=110
    export function setAddress(addr: number): void {
        _address = addr
    }

    /**
     * ゲームパッドのデータを読み込む（ループの最初に呼ぶ）
     */
    //% block="ゲームパッドを読み込む"
    //% weight=100
    export function update(): void {
        _buf = pins.i2cReadBuffer(_address, 8, false)
    }

    /**
     * ボタンが押されているか確認する
     * @param btn ボタン番号 (1〜13), eg: 1
     */
    //% block="ボタン %btn が押されている"
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

    /**
     * スティック軸の値を取得する（0〜255、中央=128）
     */
    //% block="スティック %axis の値"
    //% weight=80
    export function getAxis(axis: Axis): number {
        if (!_buf) return 128
        return _buf.getNumber(NumberFormat.UInt8LE, axis as number)
    }

    /**
     * 十字キーが指定した方向に入力されているか確認する
     */
    //% block="十字キーが %dir に入力されている"
    //% weight=70
    export function isHatPressed(dir: HatDirection): boolean {
        if (!_buf) return false
        const hat = _buf.getNumber(NumberFormat.UInt8LE, 4)
        if (dir === HatDirection.Neutral) return hat > 7
        return hat === (dir as number)
    }

    /**
     * 十字キーの生の値を取得する（0〜7=方向、15=中立）
     */
    //% block="十字キーの生の値"
    //% weight=60
    export function getHatRaw(): number {
        if (!_buf) return 15
        return _buf.getNumber(NumberFormat.UInt8LE, 4)
    }

    export enum Axis {
        //% block="左スティックX"
        LX = 0,
        //% block="左スティックY"
        LY = 1,
        //% block="右スティックX"
        RX = 2,
        //% block="右スティックY"
        RY = 3
    }

    export enum HatDirection {
        //% block="上"
        Up,
        //% block="右上"
        UpRight,
        //% block="右"
        Right,
        //% block="右下"
        DownRight,
        //% block="下"
        Down,
        //% block="左下"
        DownLeft,
        //% block="左"
        Left,
        //% block="左上"
        UpLeft,
        //% block="中立"
        Neutral
    }
}
