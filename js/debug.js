/* =========================================================
   BIRTHDAY.OS DEBUG CONSOLE
========================================================= */

(function () {

    const banner = `

%c╔════════════════════════════════════════════╗
║                                            ║
║          🎂  BIRTHDAY.OS  🎂              ║
║                                            ║
║       Friendship Engine v20.0              ║
║                                            ║
╚════════════════════════════════════════════╝

`;

    console.log(
        banner,
        "color:#ff4f9a;font-weight:bold"
    );


    window.birthday =
        {

            debug() {

                console.table({

                    System:
                        "BIRTHDAY.OS v20.0",

                    Friendship:
                        "100%",

                    Cake:
                        "ONLINE",

                    Candles:
                        Birthday.Cake
                            ? Birthday.Cake.total
                            : 20,

                    Microphone:
                        Birthday.Microphone &&
                        Birthday.Microphone.active
                            ? "ONLINE"
                            : "STANDBY",

                    State:
                        Birthday.currentState,

                    Happiness:
                        "OVERFLOW",

                    Memories:
                        "INFINITE"

                });

                console.log(
                    "%cSYSTEM STATUS: MJ deserves the best birthday ever. ❤️",
                    "color:#ff9dcb;font-size:16px;font-weight:bold"
                );

            },

            state() {

                console.log(
                    "Current state:",
                    Birthday.currentState
                );

            },

            cake() {

                console.log(
                    Birthday.Cake
                );

            },

            mic() {

                console.log(
                    Birthday.Microphone
                );

            }

        };


    console.log(
        "%cTry birthday.debug() 😉",
        "color:#ffd166;font-size:13px"
    );

})();