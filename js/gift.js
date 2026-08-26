/* =========================================================
   GIFT ENGINE
   BIRTHDAY.OS — FINAL MESSAGE SYSTEM
========================================================= */

(function () {

    /* =====================================================
       ELEMENT REFERENCES
    ====================================================== */

    const gift =
        document.getElementById(
            "gift"
        );

    const card =
        document.getElementById(
            "final-card"
        );

    const message =
        document.getElementById(
            "final-message"
        );


    /* =====================================================
       FINAL BIRTHDAY MESSAGE
    ====================================================== */

    const TEXT =
        `Happy birthday to my beautiful best friend! 💕 Honestly, life’s a lot more fun with you around. You somehow manage to make even the most random days memorable. You’ve been there through my happiest moments, my worst days, and all the crazy little moments in between. Life feels so much better with you by my side. I’m so grateful for every laugh, every late-night conversation, every secret, and every unforgettable memory we’ve made. You deserve all the love, happiness, and success in the world. Never change the amazing person you are. Here’s to another year of adventures, laughter, and making memories together. Love you always, bestie! 🎂❤️✨

From Nankul`;


    /* =====================================================
       STATE
    ====================================================== */

    let opened =
        false;


    /* =====================================================
       OPEN GIFT
    ====================================================== */

    function openGift() {

        /*
         * Prevent the gift from being opened
         * multiple times.
         */

        if (opened) {

            return;

        }


        opened =
            true;


        /* -------------------------------------------------
           Update application state
        -------------------------------------------------- */

        Birthday.setState(
            Birthday.State.GIFT
        );


        /* -------------------------------------------------
           Open the gift box
        -------------------------------------------------- */

        gift.classList.add(
            "open"
        );


        /*
         * Give the lid animation time to complete
         * before revealing the final message.
         */

        setTimeout(
            () => {

                /* -----------------------------------------
                   Reveal final card
                ------------------------------------------ */

                card.classList.add(
                    "show"
                );


                Birthday.setState(
                    Birthday.State.FINAL
                );


                /* -----------------------------------------
                   Begin typewriter
                ------------------------------------------ */

                typeMessage();

            },

            1600

        );

    }


    /* =====================================================
       TYPEWRITER ENGINE
    ====================================================== */

    function typeMessage() {

        /*
         * Clear anything currently inside
         * the message container.
         */

        message.innerHTML =
            "";


        /* -------------------------------------------------
           Create blinking cursor
        -------------------------------------------------- */

        const cursor =
            document.createElement(
                "span"
            );


        cursor.className =
            "type-cursor";


        message.appendChild(
            cursor
        );


        /* -------------------------------------------------
           Convert message into characters
        -------------------------------------------------- */

        const chars =
            Array.from(
                TEXT
            );


        let index =
            0;


        /* =================================================
           CHARACTER-BY-CHARACTER LOOP
        ================================================== */

        function next() {

            /*
             * Finished typing.
             */

            if (
                index >=
                chars.length
            ) {

                /*
                 * Let the cursor blink for a moment
                 * before removing it.
                 */

                setTimeout(
                    () => {

                        cursor.remove();

                    },

                    900

                );

                return;

            }


            const current =
                chars[index];


            /* =================================================
               NEWLINE HANDLING
            ================================================== */

            /*
             * A normal "\n" does not automatically create
             * a visible line break inside normal HTML.
             *
             * Therefore we explicitly create a <br>.
             */

            if (
                current === "\n"
            ) {

                cursor.before(
                    document.createElement(
                        "br"
                    )
                );

            }

            else {

                cursor.before(
                    document.createTextNode(
                        current
                    )
                );

            }


            index++;


            /* =================================================
               NATURAL TYPING SPEED
            ================================================== */

            let delay =
                22;


            /*
             * Slight pause after punctuation
             * to make the typing feel human.
             */

            if (
                current === "."
            ) {

                delay =
                    120;

            }


            if (
                current === ","
            ) {

                delay =
                    70;

            }


            if (
                current === "!"
            ) {

                delay =
                    140;

            }


            if (
                current === "?"
            ) {

                delay =
                    120;

            }


            /*
             * Longer pause after the newline.
             *
             * This makes "From Nankul" feel
             * deliberately separated.
             */

            if (
                current === "\n"
            ) {

                delay =
                    450;

            }


            setTimeout(
                next,
                delay
            );

        }


        /*
         * Start typing.
         */

        next();

    }


    /* =====================================================
       CLICK INTERACTION
    ====================================================== */

    if (gift) {

        gift.addEventListener(
            "click",
            openGift
        );

    }


    /* =====================================================
       KEYBOARD ACCESSIBILITY
    ====================================================== */

    if (gift) {

        gift.addEventListener(
            "keydown",
            event => {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    openGift();

                }

            }

        );

    }


    /* =====================================================
       PUBLIC API
    ====================================================== */

    Birthday.Gift = {

        open:
            openGift

    };

})();
