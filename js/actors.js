//
class Paddle extends Entity {

    constructor(xp) {
        super(xp, CANVAS_HEIGHT - 50, gTextures["paddle"])

        this.speed = 150
        this.dx = 0
        this.dy = 0

        this.inflate(2, 2)
    }

    stop() {
        this.dx = 0
    }

    move(direction) {
        switch (direction) {
            case "LEFT":
                this.dx = -this.speed
                break


            case "RIGHT":
                this.dx = this.speed
                break

            default:
                break
        }
    }

    update(dt) {
        super.update(dt)
        this.x += this.dx * dt

        //limites
        if (this.getLeft() < 0) {
            this.setLeft(0)
        }

        if (this.getRight() > CANVAS_WIDTH) {
            this.setRight(CANVAS_WIDTH)
        }

    }

    render() {
        super.render()

        super.renderDebug()
    }
}
//*********************** */
class Ball extends Entity {
    constructor(paddle, score) {
        super(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2, gTextures["ball"])

        this.paddle = paddle
        this.score = score

        this.speedMin = 100
        this.speedMax = 150
        this.dx = 0
        this.dy = 0

        this.state = "LOCKED"
        this.inflate(3, 3)
    }

    setLocked() {
        this.state = "LOCKED"
    }

    newSpeedX() {
        this.dx = random(this.speedMin, this.speedMax)
    }

    newSpeedY() {
        this.dy = random(this.speedMin, this.speedMax)
    }

    removeX() {
        let dir = (this.dx > 0)

        this.newSpeedX()

        if (dir > 0) {
            this.dx = this.dx * -1
        }
    }

    removeY() {
        let dir = (this.dy > 0)

        this.newSpeedY()

        if (dir > 0) {
            this.dy = this.dy * -1
        }
    }

    setMouvement() {
        if (this.state === "LOCKED") {
            this.state = "MOVE"
            this.newSpeedX()
            this.newSpeedY()
        }

    }

    collidePaddle() {
        if (this.collides(this.paddle) && this.dy > 0) {
            gSounds["bounce"].stop()
            gSounds["bounce"].play()
            this.removeY()
        }
    }


    update(dt) {
        super.update(dt)

        if (this.state === "LOCKED") {
            this.setBottom(this.paddle.getTop())

            this.setCenterX(this.paddle.getCenterX())

        } else if (this.state === "MOVE") {

            this.x += this.dx * dt
            this.y += this.dy * dt

            this.collidePaddle()

            //limites
            if (this.getTop() < 0 && this.dy < 0) {
                //this.removeX()
                this.removeY()
            }

            if (this.getLeft() < 0 && this.dx < 0) {
                this.removeX()
                //this.removeY()
            }

            if (this.getRight() > CANVAS_WIDTH && this.dx > 0) {
                this.removeX()
                // this.removeY()
            }


            //canvas bottom
            if (this.getBottom() > CANVAS_HEIGHT && this.dy > 0) {
                this.state = "LOCKED"
                gSounds["spawn"].stop()
                gSounds["spawn"].play()

                this.score.decrementsLives()
            }
        }


    }

    render() {
        super.render()

        // super.renderDebug()
    }
}
//************************* */
class Block extends Entity {
    constructor(xp, yp, type) {

        switch (type) {
            case "BLUE":
                super(xp, yp, gTextures["block_blue"])
                break

            case "GREEN":
                super(xp, yp, gTextures["block_green"])
                break


            case "RED":
                super(xp, yp, gTextures["block_red"])
                break

            case "YELLOW":
                super(xp, yp, gTextures["block_yellow"])
                break

            default:
                super(xp, yp, gTextures["block_blue"])
                break;
        }

        this.state = "VISIBLE"
        this.dx = 0
        this.dy = 0

        this.inflate(5, 5)
    }

    touched() {
        this.state = "TOUCHED"
    }

    update(dt) {
        super.update(dt)
    }

    render() {
        if (this.state === "VISIBLE") {
            super.render()
        }

        //super.renderDebug()
    }
}
//************************* */
class Matrice {
    constructor(score) {
        this.score = score
        this.nbCol = floor(CANVAS_WIDTH / (2 * BLOCK_WIDTH))
        this.nbRow = 4

        this.py = 50

        this.tabBlocks = new Array(this.nbRow)

        this.createGrid()

    }

    createGrid() {
        for (let j = 0; j < this.nbRow; j++) {
            this.tabBlocks[j] = new Array(this.nbCol)
        }

        let row = 0

        this.createRow(row, this.py, "BLUE")

        this.py += 50
        row++
        this.createRow(row, this.py, "GREEN")

        this.py += 50
        row++
        this.createRow(row, this.py, "RED")

        this.py += 50
        row++
        this.createRow(row, this.py, "YELLOW")
    }

    newWave() {
        for (let j = 0; j < this.nbRow; j++) {
            for (let i = 0; i < this.nbCol; i++) {
                this.tabBlocks[j][i].state = "VISIBLE"

            }
        }
    }

    createRow(row, yp, type) {
        for (let i = 0; i < this.nbCol; i++) {
            this.tabBlocks[row][i] = new Block(i * BLOCK_WIDTH * 2, yp, type)
        }
    }

    collideBall(ball) {
        for (let j = 0; j < this.nbRow; j++) {
            for (let i = 0; i < this.nbCol; i++) {

                let item = this.tabBlocks[j][i]

                if (item != undefined && item.state === "VISIBLE" && ball.state === "MOVE") {
                    if (ball.collides(item)) {
                        //console.log("collide: " + j + " : " + i)
                        this.tabBlocks[j][i].touched()
                        ball.removeY()
                        ball.removeX()
                        gSounds["explosion"].stop()
                        gSounds["explosion"].play()
                        this.score.incrementsPoints(1)
                        return
                    }
                }
            }
        }
    }

    update(dt) {
        for (let j = 0; j < this.nbRow; j++) {
            for (let i = 0; i < this.nbCol; i++) {

                let item = this.tabBlocks[j][i]

                if (item != undefined) {
                    this.tabBlocks[j][i].update(dt)
                }
            }
        }
    }

    isMatriceDestroy() {
        for (let j = 0; j < this.nbRow; j++) {
            for (let i = 0; i < this.nbCol; i++) {

                if (this.tabBlocks[j][i].state === "VISIBLE") {
                    return false
                }
            }
        }
        
        return true
    }

    render() {
        for (let j = 0; j < this.nbRow; j++) {
            for (let i = 0; i < this.nbCol; i++) {

                let item = this.tabBlocks[j][i]

                if (item != undefined && item.state === "VISIBLE") {
                    this.tabBlocks[j][i].render()
                }
            }
        }
    }
}