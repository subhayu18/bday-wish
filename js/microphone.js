/* =========================================================
   MICROPHONE ENGINE
========================================================= */

(function () {

    const button =
        document.getElementById(
            "enable-mic"
        );

    const fallback =
        document.getElementById(
            "skip-mic"
        );

    const overlay =
        document.getElementById(
            "mic-start"
        );

    const status =
        document.getElementById(
            "mic-status"
        );

    const meter =
        document.getElementById(
            "mic-meter-fill"
        );


    let stream =
        null;

    let context =
        null;

    let analyser =
        null;

    let source =
        null;

    let timeData =
        null;

    let frequencyData =
        null;

    let active =
        false;


    async function enable() {

        if (
            !navigator.mediaDevices ||
            !navigator.mediaDevices
                .getUserMedia
        ) {

            activateFallback();

            return;

        }


        button.disabled =
            true;

        button.textContent =
            "Requesting microphone...";


        try {

            stream =
                await navigator
                    .mediaDevices
                    .getUserMedia({

                        audio: {

                            echoCancellation:
                                true,

                            noiseSuppression:
                                true,

                            autoGainControl:
                                false

                        }

                    });


            context =
                new (
                    window.AudioContext ||
                    window.webkitAudioContext
                )();


            if (
                context.state ===
                "suspended"
            ) {

                await context.resume();

            }


            source =
                context.createMediaStreamSource(
                    stream
                );


            analyser =
                context.createAnalyser();


            analyser.fftSize =
                2048;

            analyser.smoothingTimeConstant =
                .72;


            timeData =
                new Uint8Array(
                    analyser.fftSize
                );


            frequencyData =
                new Uint8Array(
                    analyser.frequencyBinCount
                );


            source.connect(
                analyser
            );


            active =
                true;


            overlay.classList.add(
                "hidden"
            );


            Birthday.setState(
                Birthday.State.BLOWING
            );


            status.textContent =
                "Listening — blow toward your microphone 💨";


            Birthday.BlowDetector.start({

                analyser,

                timeData,

                frequencyData

            });


        }
        catch (error) {

            console.error(
                error
            );

            activateFallback();

        }

    }


    function activateFallback() {

        overlay.classList.add(
            "hidden"
        );

        status.textContent =
            "Tap the cake to blow out each candle 🎂";

        Birthday.setState(
            Birthday.State.BLOWING
        );


        document
            .getElementById(
                "scene-cake"
            )
            .addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest(
                            ".mic-hud"
                        )
                    )
                        return;

                    Birthday.App
                        .manualBlow();

                }
            );

    }


    function stop() {

        active =
            false;


        if (stream) {

            stream
                .getTracks()
                .forEach(
                    track =>
                        track.stop()
                );

        }


        if (context) {

            context.close()
                .catch(
                    () => {}
                );

        }

    }


    button.addEventListener(
        "click",
        enable
    );


    fallback.addEventListener(
        "click",
        activateFallback
    );


    Birthday.Microphone = {

        prepare() {

            overlay.classList.remove(
                "hidden"
            );

        },

        enable,

        stop,

        get analyser() {

            return analyser;

        },

        get active() {

            return active;

        }

    };

})();