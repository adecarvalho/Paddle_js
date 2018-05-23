//
class IntroStage extends Stage {
    constructor(gsm) {
        super(gsm)

        this.tab = [65, 65, 65]
        this.indice = 0
        this.timer = 0
        this.toggle = true

        this.label = new Label()
        this.label.setSize(50)
        this.label.setColor(color(250, 250, 250))

        this.name = "aaa"
    }

    update(dt) {
        this.timer += dt
        if (this.timer > 0.4) {
            this.timer = 0
            this.toggle = !this.toggle
        }

        if (gInput.isKeyPressed(ENTER)) {

            this.name = "" + char(this.tab[0]) + char(this.tab[1]) + char(this.tab[2])

            let datas = {
                "name": this.name
            }

            gsm.changeStage(gStages.get("play"), datas)
        }

        if (gInput.isKeyPressed(LEFT_ARROW) && this.indice > 0) {
            this.indice = this.indice - 1
        }

        if (gInput.isKeyPressed(RIGHT_ARROW) && this.indice < 2) {
            this.indice = this.indice + 1
        }

        if (gInput.isKeyPressed(UP_ARROW)) {
            this.tab[this.indice] = this.tab[this.indice] + 1
            if (this.tab[this.indice] > 90) {
                this.tab[this.indice] = 65
            }
        }

        if (gInput.isKeyPressed(DOWN_ARROW)) {
            this.tab[this.indice] = this.tab[this.indice] - 1
            if (this.tab[this.indice] < 65) {
                this.tab[this.indice] = 90
            }
        }

    }

    render() {

        this.label.setText("Paddle js")
        this.label.render(CANVAS_WIDTH / 3, CANVAS_HEIGHT / 4)

        this.afficheName()

        this.label.setText('Press Enter to Start')
        this.label.render(50, 150 + CANVAS_HEIGHT / 2)

    }

    onEnter() {
        gSounds["menu"].setLoop(true)
        gSounds["menu"].play()
    }

    onExit() {
        gSounds["menu"].setLoop(false)
        gSounds["menu"].stop()

    }
    afficheName() {
        let xp = CANVAS_WIDTH / 2 - 100
        let yp = CANVAS_HEIGHT / 2

        //**************** */
        if (this.indice == 0) {
            if (this.toggle) {
                text(char(this.tab[0]), xp, yp)
            }
            text(char(this.tab[1]), xp + 50, yp)
            text(char(this.tab[2]), xp + 100, yp)
        }
        //******************** */
        else if (this.indice == 1) {
            if (this.toggle) {
                text(char(this.tab[1]), xp + 50, yp)
            }
            text(char(this.tab[0]), xp, yp)
            text(char(this.tab[2]), xp + 100, yp)
        }
        //********************* */
        else if (this.indice == 2) {
            if (this.toggle) {
                text(char(this.tab[2]), xp + 100, yp)
            }
            text(char(this.tab[0]), xp, yp)
            text(char(this.tab[1]), xp + 50, yp)
        }
    }
}
//********************* */
//******************** */
class OverStage extends Stage {
    constructor(gsm) {
        super(gsm)

        this.label = new Label()
        this.label.setSize(50)
        this.label.setColor(color(250, 250, 250))

        this.name = "aaa"
        this.score = 0
    }

    update(dt) {
        if (gInput.isKeyPressed(ENTER)) {

            gsm.changeStage(gStages.get("introduction"))
        }
    }

    render() {

        this.label.setText("Game Over " + this.name)
        this.label.render(CANVAS_WIDTH / 4, CANVAS_HEIGHT / 4)

        this.label.setText("Score= " + this.score + " pts")
        this.label.render(CANVAS_WIDTH / 4, CANVAS_HEIGHT / 2)

        this.label.setText('Press a Enter\n to Start')
        this.label.render(CANVAS_WIDTH / 4, 100 + CANVAS_HEIGHT / 2)
    }

    onEnter(datas) {

        if (datas) {
            this.name = datas.name
            this.score = datas.points
        }
        gSounds["menu"].setLoop(true)
        gSounds["menu"].play()

    }

    onExit() {
        gSounds["menu"].setLoop(false)
        gSounds["menu"].stop()
    }
}
//********************* */
class PlayStage extends Stage {
    constructor(gsm) {
        super(gsm)
        this.score = new ScoreManager()

        this.paddle = new Paddle(CANVAS_WIDTH / 2 - 25)

        this.ball = new Ball(this.paddle, this.score)

        this.matrice = new Matrice(this.score)

    }

    update(dt) {

        this.paddle.update(dt)

        this.ball.update(dt)

        this.matrice.update(dt)

        this.matrice.collideBall(this.ball)

        //
        if (gInput.isKeyPressed(32)) {
            this.ball.setMouvement()
        }

        if (gInput.isKeyPressed(LEFT_ARROW)) {
            this.paddle.move("LEFT")
        }
        if (gInput.isKeyPressed(RIGHT_ARROW)) {
            this.paddle.move("RIGHT")
        }

        if (gInput.isKeyReleased(LEFT_ARROW) || gInput.isKeyReleased(RIGHT_ARROW)) {
            this.paddle.stop()
        }

        this.score.update(dt)

        if (this.score.isGameOver()) {
            let datas = {
                "name": this.score.getName(),
                "points": this.score.getPoints()
            }

            gsm.changeStage(gStages.get("gameover"), datas)
        }

        if (this.matrice.isMatriceDestroy()) {
            this.ball.setLocked()
            this.matrice.newWave()
        }
    }

    render() {
        this.paddle.render()

        this.ball.render()

        this.matrice.render()

        this.score.render()
    }

    onEnter(datas) {
        gSounds["game"].setLoop(true)
        gSounds["game"].play()

        if (datas != undefined) {
            this.score.setName(datas.name)
            this.score.reset()
        }

        this.matrice.newWave()

    }

    onExit() {
        gSounds["game"].setLoop(false)
        gSounds["game"].stop()
    }
}
//fin playstage