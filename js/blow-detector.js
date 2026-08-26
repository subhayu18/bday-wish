/* =========================================================
   ADVANCED BLOW DETECTOR
========================================================= */

(function () {

    let analyser;
    let timeData;
    let frequencyData;

    let running =
        false;

    let noiseFloor =
        0.008;

    let smoothedEnergy =
        0;

    let previousEnergy =
        0;

    let lastBlow =
        0;

    const COOLDOWN =
        650;


    function calculateRMS() {

        let sum =
            0;


        for (
            let i = 0;
            i < timeData.length;
            i++
        ) {

            const value =
                (timeData[i] - 128) /
                128;

            sum +=
                value * value;

        }


        return Math.sqrt(
            sum /
            timeData.length
        );

    }


    /*
     * Blowing tends to contain significant
     * broadband energy rather than a strong
     * single pitch.
     */

    function calculateSpectralSpread() {

        let total =
            0;

        let weighted =
            0;


        for (
            let i = 0;
            i < frequencyData.length;
            i++
        ) {

            const energy =
                frequencyData[i];

            total +=
                energy;

            weighted +=
                energy * i;

        }


        if (
            total === 0
        )
            return 0;


        const centroid =
            weighted / total;


        return centroid /
            frequencyData.length;

    }


    function analyse() {

        if (!running)
            return;


        analyser.getByteTimeDomainData(
            timeData
        );

        analyser.getByteFrequencyData(
            frequencyData
        );


        const rms =
            calculateRMS();


        const spectralSpread =
            calculateSpectralSpread();


        /*
         * Adaptive noise floor.
         */

        if (
            rms <
            noiseFloor * 1.8
        ) {

            noiseFloor =
                noiseFloor * .97 +
                rms * .03;

        }


        /*
         * Smooth signal.
         */

        smoothedEnergy =
            smoothedEnergy * .72 +
            rms * .28;


        /*
         * Rate of increase.
         */

        const attack =
            smoothedEnergy -
            previousEnergy;


        previousEnergy =
            smoothedEnergy;


        /*
         * Visual microphone meter.
         */

        const meter =
            document.getElementById(
                "mic-meter-fill"
            );


        if (meter) {

            const percentage =
                Math.min(
                    100,
                    smoothedEnergy *
                    900
                );

            meter.style.width =
                percentage + "%";

        }


        /*
         * Blow score.

         * Energy:
         *   How loud is it?

         * Attack:
         *   Did the sound suddenly increase?

         * Spectrum:
         *   Is energy spread across
         *   multiple frequencies?
         */

        const energyScore =
            Math.min(
                1,
                smoothedEnergy /
                Math.max(
                    .025,
                    noiseFloor * 4
                )
            );


        const attackScore =
            Math.min(
                1,
                Math.max(
                    0,
                    attack * 80
                )
            );


        const broadbandScore =
            Math.min(
                1,
                Math.max(
                    0,
                    spectralSpread * 2.2
                )
            );


        const blowScore =
            energyScore * .55 +
            attackScore * .25 +
            broadbandScore * .20;


        const now =
            performance.now();


        /*
         * Detection threshold.
         */

        if (

            blowScore >
            .72 &&

            smoothedEnergy >
            Math.max(
                .025,
                noiseFloor * 3
            ) &&

            now -
            lastBlow >
            COOLDOWN

        ) {

            lastBlow =
                now;


            /*
             * Strength between 0 and 1.
             */

            const strength =
                Math.min(
                    1,
                    blowScore
                );


            onBlow(
                strength
            );

        }


        requestAnimationFrame(
            analyse
        );

    }


    function onBlow(
        strength
    ) {

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


        /*
         * Stronger blows can extinguish
         * multiple candles.

         * Gentle blows usually remove one.
         */

        let count =
            1;


        if (
            strength > .92 &&
            remaining.length > 3
        ) {

            count = 3;

        }
        else if (
            strength > .82 &&
            remaining.length > 1
        ) {

            count = 2;

        }


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const candle =
                remaining[i];


            if (candle) {

                const index =
                    Number(
                        candle.dataset.index
                    );


                Birthday.Cake
                    .blowCandle(
                        index,
                        strength
                    );

            }

        }


        const status =
            document.getElementById(
                "mic-status"
            );


        if (status) {

            status.textContent =
                `💨 Blow detected — strength ${Math.round(strength * 100)}%`;

        }

    }


    Birthday.BlowDetector = {

        start(options) {

            analyser =
                options.analyser;

            timeData =
                options.timeData;

            frequencyData =
                options.frequencyData;

            running =
                true;

            analyse();

        },

        stop() {

            running =
                false;

        }

    };

})();