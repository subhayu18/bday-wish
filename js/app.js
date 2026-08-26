/* =========================================================
   BIRTHDAY.OS APPLICATION
========================================================= */

(function () {

    const celebrationScene =
        document.getElementById(
            "scene-celebration"
        );

    const cakeScene =
        document.getElementById(
            "scene-cake"
        );

    const giftScene =
        document.getElementById(
            "scene-gift"
        );


    let finished =
        false;


    function showScene(
        scene
    ) {

        document
            .querySelectorAll(
                ".scene"
            )
            .forEach(
                element =>
                    element.classList.remove(
                        "active"
                    )
            );


        scene.classList.add(
            "active"
        );

    }


    function allCandlesExtinguished() {

        if (finished)
            return;

        finished =
            true;


        Birthday.setState(
            Birthday.State.CELEBRATION
        );


        /*
         * Kill microphone.
         */

        if (
            Birthday.BlowDetector
        ) {

            Birthday.BlowDetector.stop();

        }


        if (
            Birthday.Microphone
        ) {

            Birthday.Microphone.stop();

        }


        /*
         * Celebrate.
         */

        showScene(
            celebrationScene
        );


        /*
         * Massive central explosion.
         */

        setTimeout(
            () => {

                Birthday.Confetti.burst(
                    900,
                    window.innerWidth / 2,
                    window.innerHeight / 2
                );

            },
            200
        );


        /*
         * Additional side bursts.
         */

        setTimeout(
            () => {

                Birthday.Confetti.burst(
                    300,
                    window.innerWidth * .15,
                    window.innerHeight * .55
                );

                Birthday.Confetti.burst(
                    300,
                    window.innerWidth * .85,
                    window.innerHeight * .55
                );

            },
            700
        );


        /*
         * Start birthday song.
         */

        setTimeout(
            () => {

                Birthday.Audio.play();

            },
            900
        );


        /*
         * Move toward present.
         */

        setTimeout(
            () => {

                showGiftScene();

            },
            6000
        );

    }


    function showGiftScene() {

        Birthday.setState(
            Birthday.State.GIFT
        );


        showScene(
            giftScene
        );


        /*
         * Give the user a moment to
         * admire the gift before opening.
         */

        setTimeout(
            () => {

                Birthday.Gift.open();

            },
            2200
        );

    }


    function manualBlow() {

        if (
            !Birthday.Cake
        )
            return;


        const remaining =
            Birthday.Cake.candles
                .filter(
                    candle =>
                        !candle.classList.contains(
                            "extinguished"
                        )
                );


        if (
            remaining.length === 0
        )
            return;


        const candle =
            remaining[0];


        Birthday.Cake
            .blowCandle(
                Number(
                    candle.dataset.index
                ),
                .9
            );

    }


    Birthday.App = {

        allCandlesExtinguished,

        manualBlow,

        showGiftScene

    };


    Birthday.setState(
        Birthday.State.ENVELOPE
    );

})();