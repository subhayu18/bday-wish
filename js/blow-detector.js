/* =========================================================
   ADVANCED BLOW DETECTOR
   BIRTHDAY.OS — v2.0
========================================================= */

(function () {

    let analyser;
    let timeData;
    let frequencyData;

    let running = false;

    /*
     * Adaptive background-noise estimate.
     * This slowly learns the normal microphone level.
     */
    let noiseFloor = 0.008;

    /*
     * Smoothed microphone energy.
     * Lower smoothing = faster reaction.
     */
    let smoothedEnergy = 0;

    let previousEnergy = 0;

    /*
     * Prevents one long blow from triggering
     * repeatedly every animation frame.
     */
    let lastBlow = 0;

    /*
     * Time between two accepted blows.
     *
     * 450 ms makes the detector feel responsive
     * while still preventing accidental rapid triggers.
     */
    const COOLDOWN = 450;


    /* =====================================================
       RMS / LOUDNESS
    ====================================================== */

    function calculateRMS() {

        let sum = 0;

        for (
            let i = 0;
            i < timeData.length;
            i++
        ) {

            /*
             * Convert unsigned 0–255 microphone samples
             * into approximately -1 to +1.
             */
            const value =
                (timeData[i] - 128) / 128;

            sum += value * value;

        }

        return Math.sqrt(
            sum / timeData.length
        );

    }


    /* =====================================================
       SPECTRAL ANALYSIS
    ====================================================== */

    /*
     * A blow generally produces broadband energy
     * rather than a clean musical pitch.
     *
     * This gives us a rough indication of where
     * the microphone's energy is concentrated.
     */

    function calculateSpectralSpread() {

        let total = 0;

        let weighted = 0;

        for (
            let i = 0;
            i < frequencyData.length;
            i++
        ) {

            const energy =
                frequencyData[i];

            total += energy;

            weighted +=
                energy * i;

        }


        if (total === 0) {

            return 0;

        }


        const centroid =
            weighted / total;


        return (
            centroid /
            frequencyData.length
        );

    }


    /* =====================================================
       MICROPHONE ANALYSIS LOOP
    ====================================================== */

    function analyse() {

        if (!running) {

            return;

        }


        /*
         * Grab fresh microphone data.
         */

        analyser.getByteTimeDomainData(
            timeData
        );

        analyser.getByteFrequencyData(
            frequencyData
        );


        /* -------------------------------------------------
           Calculate raw signal properties
        -------------------------------------------------- */

        const rms =
            calculateRMS();

        const spectralSpread =
            calculateSpectralSpread();


        /* =================================================
           ADAPTIVE NOISE FLOOR
        ================================================== */

        /*
         * If the microphone is relatively quiet,
         * slowly update our estimate of background noise.
         *
         * We deliberately DON'T update the noise floor
         * during louder sounds, otherwise a blow could
         * teach the detector that the blow itself is noise.
         */

        if (
            rms <
            noiseFloor * 1.8
        ) {

            noiseFloor =
                noiseFloor * 0.97 +
                rms * 0.03;

        }


        /*
         * Keep the noise estimate inside sensible bounds.
         */

        noiseFloor =
            Math.max(
                0.002,
                Math.min(
                    noiseFloor,
                    0.08
                )
            );


        /* =================================================
           SMOOTH MICROPHONE SIGNAL
        ================================================== */

        /*
         * 0.62 / 0.38 gives considerably faster response
         * than the original 0.72 / 0.28 smoothing.
         */

        smoothedEnergy =
            smoothedEnergy * 0.62 +
            rms * 0.38;


        /* =================================================
           ATTACK DETECTION
        ================================================== */

        /*
         * A deliberate blow usually causes the sound
         * level to rise quickly.
         */

        const attack =
            smoothedEnergy -
            previousEnergy;


        previousEnergy =
            smoothedEnergy;


        /* =================================================
           MICROPHONE VISUALIZER
        ================================================== */

        const meter =
            document.getElementById(
                "mic-meter-fill"
            );


        if (meter) {

            const percentage =
                Math.min(
                    100,
                    smoothedEnergy * 900
                );


            meter.style.width =
                percentage + "%";

        }


        /* =================================================
           ENERGY SCORE
        ================================================== */

        /*
         * How much louder is the current signal than
         * the learned background?
         *
         * Lowering the minimum from .025 to .015 makes
         * gentle blows easier to detect.
         */

        const energyScore =
            Math.min(
                1,

                smoothedEnergy /
                Math.max(
                    0.015,
                    noiseFloor * 3
                )

            );


        /* =================================================
           ATTACK SCORE
        ================================================== */

        /*
         * Stronger multiplier means a sudden puff
         * gets recognized more quickly.
         */

        const attackScore =
            Math.min(
                1,

                Math.max(
                    0,
                    attack * 100
                )

            );


        /* =================================================
           BROADBAND SCORE
        ================================================== */

        /*
         * Helps distinguish a breath/blow from a
         * sustained pure tone.
         */

        const broadbandScore =
            Math.min(
                1,

                Math.max(
                    0,
                    spectralSpread * 2.2
                )

            );


        /* =================================================
           FINAL BLOW SCORE
        ================================================== */

        /*
         * Weighted combination:
         *
         * 55% → loudness
         * 25% → suddenness
         * 20% → spectral characteristics
         */

        const blowScore =
            energyScore * 0.55 +
            attackScore * 0.25 +
            broadbandScore * 0.20;


        const now =
            performance.now();


        /* =================================================
           DETECTION THRESHOLD
        ================================================== */

        /*
         * The original detector used:
         *
         *     blowScore > 0.72
         *
         * We've lowered that to 0.48.
         *
         * This makes gentle blowing substantially easier.
         */

        const isStrongEnough =
            blowScore > 0.48;


        /*
         * The signal must also be sufficiently above
         * the current noise floor.
         */

        const isLoudEnough =
            smoothedEnergy >
            Math.max(
                0.015,
                noiseFloor * 2
            );


        /*
         * Prevent duplicate triggers from the same blow.
         */

        const cooldownFinished =
            (
                now -
                lastBlow
            ) > COOLDOWN;


        /* =================================================
           BLOW CONFIRMED
        ================================================== */

        if (
            isStrongEnough &&
            isLoudEnough &&
            cooldownFinished
        ) {

            lastBlow =
                now;


            /*
             * Convert blow score into 0–1 strength.
             */

            const strength =
                Math.min(
                    1,
                    Math.max(
                        0.45,
                        blowScore
                    )
                );


            onBlow(
                strength
            );

        }


        /*
         * Continue monitoring.
         */

        requestAnimationFrame(
            analyse
        );

    }


    /* =====================================================
       BLOW RESPONSE
    ====================================================== */

    function onBlow(
        strength
    ) {

        if (
            !Birthday.Cake
        ) {

            return;

        }


        /*
         * Find candles that are still burning.
         */

        const remaining =
            Birthday.Cake.candles.filter(
                candle =>
                    !candle.classList.contains(
                        "extinguished"
                    )
            );


        if (
            remaining.length === 0
        ) {

            return;

        }


        /* =================================================
           DETERMINE HOW MANY CANDLES TO EXTINGUISH
        ================================================== */

        /*
         * Gentle blow:
         *     1 candle
         *
         * Medium blow:
         *     1–2 candles
         *
         * Strong blow:
         *     potentially 3 candles
         */

        let count = 1;


        if (
            strength > 0.92 &&
            remaining.length > 3
        ) {

            count = 3;

        }

        else if (
            strength > 0.82 &&
            remaining.length > 1
        ) {

            count = 2;

        }


        /*
         * Never attempt to extinguish more candles
         * than actually remain.
         */

        count =
            Math.min(
                count,
                remaining.length
            );


        /* =================================================
           EXTINGUISH CANDLES
        ================================================== */

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const candle =
                remaining[i];


            if (!candle) {

                continue;

            }


            const index =
                Number(
                    candle.dataset.index
                );


            Birthday.Cake.blowCandle(
                index,
                strength
            );

        }


        /* =================================================
           UPDATE MICROPHONE STATUS
        ================================================== */

        const status =
            document.getElementById(
                "mic-status"
            );


        if (status) {

            status.textContent =
                `💨 Blow detected — strength ${Math.round(
                    strength * 100
                )}%`;

        }

    }


    /* =====================================================
       PUBLIC API
    ====================================================== */

    Birthday.BlowDetector = {

        start(options) {

            /*
             * Receive the Web Audio analyser from
             * microphone.js.
             */

            analyser =
                options.analyser;


            timeData =
                options.timeData;


            frequencyData =
                options.frequencyData;


            /*
             * Reset detector state whenever the
             * microphone starts.
             */

            running =
                true;

            noiseFloor =
                0.008;

            smoothedEnergy =
                0;

            previousEnergy =
                0;

            lastBlow =
                0;


            /*
             * Begin the real-time analysis loop.
             */

            analyse();

        },


        stop() {

            running =
                false;

        }

    };

})();
