/* =========================================================
   ENVELOPE ENGINE
========================================================= */

(function () {

    const envelope =
        document.getElementById(
            "envelope"
        );

    const prompt =
        document.getElementById(
            "open-prompt"
        );

    if (!envelope)
        return;


    let opened =
        false;


    function openEnvelope() {

        if (opened)
            return;

        opened =
            true;

        Birthday.setState(
            Birthday.State.NOTE
        );

        envelope.classList.add(
            "open"
        );

        if (prompt) {

            prompt.style.opacity =
                "0";

        }

        /*
         * Cinematic pause before moving
         * to the cake.
         */

        setTimeout(
            () => {

                Birthday.setState(
                    Birthday.State.CAKE
                );

                document
                    .getElementById(
                        "scene-envelope"
                    )
                    .classList.remove(
                        "active"
                    );

                document
                    .getElementById(
                        "scene-cake"
                    )
                    .classList.add(
                        "active"
                    );

                if (
                    Birthday.Microphone
                ) {

                    Birthday.Microphone
                        .prepare();

                }

            },
            5600
        );

    }


    envelope.addEventListener(
        "click",
        openEnvelope
    );


    envelope.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter" ||
                event.key === " "
            ) {

                event.preventDefault();

                openEnvelope();

            }

        }
    );

})();