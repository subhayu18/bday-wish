/* =========================================================
   BIRTHDAY.OS — STATE ENGINE
========================================================= */

window.Birthday = window.Birthday || {};

Birthday.State = {

    ENVELOPE:
        "ENVELOPE",

    NOTE:
        "NOTE",

    CAKE:
        "CAKE",

    MICROPHONE:
        "MICROPHONE",

    BLOWING:
        "BLOWING",

    CELEBRATION:
        "CELEBRATION",

    GIFT:
        "GIFT",

    FINAL:
        "FINAL"

};

Birthday.currentState =
    Birthday.State.ENVELOPE;

Birthday.setState =
    function (state) {

        Birthday.currentState =
            state;

        const debug =
            document.getElementById(
                "debug-state"
            );

        if (debug) {

            debug.textContent =
                state;

        }

        document.body.dataset.state =
            state;

        console.log(
            `%c[BIRTHDAY.OS]%c ${state}`,
            "color:#ff4f9a;font-weight:bold",
            "color:white"
        );

    };