/* =========================================================
   CAKE ENGINE
========================================================= */

(function () {

    const container =
        document.getElementById(
            "candles"
        );

    if (!container)
        return;


    const TOTAL =
        20;


    const candles = [];


    function createCandles() {

        for (
            let i = 0;
            i < TOTAL;
            i++
        ) {

            const candle =
                document.createElement(
                    "div"
                );

            candle.className =
                "candle";

            candle.dataset.index =
                i;


            const wick =
                document.createElement(
                    "div"
                );

            wick.className =
                "candle-wick";


            const flame =
                document.createElement(
                    "div"
                );

            flame.className =
                "candle-flame";


            candle.appendChild(
                wick
            );

            candle.appendChild(
                flame
            );


            container.appendChild(
                candle
            );

            candles.push(
                candle
            );

        }

    }


    function getCandle(index) {

        return candles[index];

    }


    function blowCandle(
        index,
        strength = 1
    ) {

        const candle =
            candles[index];

        if (!candle)
            return false;

        if (
            candle.classList.contains(
                "extinguished"
            )
        )
            return false;


        candle.classList.add(
            "blowing"
        );


        /*
         * Stronger blows cause more
         * dramatic flame bending.
         */

        const flame =
            candle.querySelector(
                ".candle-flame"
            );

        if (flame) {

            const angle =
                42 +
                strength * 30;

            const offset =
                Math.min(
                    45,
                    strength * 35
                );

            flame.style.transform =
                `translateX(calc(-50% + ${offset}px))
                 rotate(${angle}deg)
                 scale(${Math.max(.45, 1 - strength * .3)})`;

        }


        setTimeout(
            () => {

                candle.classList.remove(
                    "blowing"
                );

                candle.classList.add(
                    "extinguished"
                );

                createSmoke(
                    candle
                );

                updateCounter();

            },
            180 +
            Math.random() * 180
        );


        return true;

    }


    function createSmoke(
        candle
    ) {

        const rect =
            candle.getBoundingClientRect();


        for (
            let i = 0;
            i < 5;
            i++
        ) {

            const smoke =
                document.createElement(
                    "span"
                );

            smoke.className =
                "smoke";


            smoke.style.left =
                rect.left +
                rect.width / 2 +
                "px";

            smoke.style.top =
                rect.top -
                20 +
                "px";


            document.body.appendChild(
                smoke
            );


            const drift =
                (Math.random() - .5) *
                80;


            smoke.animate(
                [
                    {

                        transform:
                            "translate(0,0) scale(.4)",

                        opacity:
                            .6

                    },

                    {

                        transform:
                            `translate(${drift}px,-100px)
                             scale(${1.5 + Math.random()})`,

                        opacity:
                            0

                    }

                ],
                {

                    duration:
                        900 +
                        Math.random() *
                        800,

                    easing:
                        "ease-out"

                }
            ).onfinish =
                () => smoke.remove();

        }

    }


    function updateCounter() {

        const left =
            candles.filter(
                candle =>
                    !candle.classList.contains(
                        "extinguished"
                    )
            ).length;


        const counter =
            document.getElementById(
                "candles-left"
            );

        if (counter) {

            counter.textContent =
                left;

        }


        if (
            left === 0 &&
            Birthday.App
        ) {

            Birthday.App
                .allCandlesExtinguished();

        }

    }


    Birthday.Cake = {

        candles,

        getCandle,

        blowCandle,

        updateCounter,

        total:
            TOTAL

    };


    createCandles();

})();