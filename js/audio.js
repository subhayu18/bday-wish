/* =========================================================
   AUDIO ENGINE
========================================================= */

(function () {

    const audio =
        document.getElementById(
            "birthday-audio"
        );


    function play() {

        if (!audio)
            return;


        audio.currentTime =
            0;

        audio.volume =
            0;


        const promise =
            audio.play();


        if (
            promise &&
            promise.catch
        ) {

            promise.catch(
                error =>
                    console.warn(
                        "Audio playback:",
                        error
                    )
            );

        }


        let volume =
            0;


        const fade =
            setInterval(
                () => {

                    volume +=
                        .05;

                    audio.volume =
                        Math.min(
                            1,
                            volume
                        );


                    if (
                        volume >= 1
                    ) {

                        clearInterval(
                            fade
                        );

                    }

                },
                70
            );

    }


    function stop() {

        if (!audio)
            return;

        audio.pause();

    }


    Birthday.Audio = {

        play,

        stop

    };

})();