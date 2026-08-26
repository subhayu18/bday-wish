/* =========================================================
   GIFT ENGINE
========================================================= */

(function () {

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


    const TEXT =
        `Happy birthday to my beautiful best friend! 💕 I honestly don’t know what I’d do without you. You’ve been there through my happiest moments, my worst days, and all the crazy little moments in between. Life feels so much better with you by my side. I’m so grateful for every laugh, every late-night conversation, every secret, and every unforgettable memory we’ve made. You deserve all the love, happiness, and success in the world. Never change the amazing person you are. Here’s to another year of adventures, laughter, and making memories together. Love you always, bestie! 🎂❤️✨`;


    let opened =
        false;


    function openGift() {

        if (opened)
            return;

        opened =
            true;


        Birthday.setState(
            Birthday.State.GIFT
        );


        gift.classList.add(
            "open"
        );


        /*
         * Let the lid animation breathe
         * before revealing the card.
         */

        setTimeout(
            () => {

                card.classList.add(
                    "show"
                );


                Birthday.setState(
                    Birthday.State.FINAL
                );


                typeMessage();

            },
            1600
        );

    }


    function typeMessage() {

        message.innerHTML =
            "";


        const cursor =
            document.createElement(
                "span"
            );

        cursor.className =
            "type-cursor";


        message.appendChild(
            cursor
        );


        const chars =
            Array.from(
                TEXT
            );


        let index =
            0;


        function next() {

            if (
                index >=
                chars.length
            ) {

                cursor.remove();

                return;

            }


            cursor.before(
                document.createTextNode(
                    chars[index]
                )
            );


            index++;


            const current =
                chars[index - 1];


            let delay =
                22;


            if (
                current === "."
            )
                delay = 120;


            if (
                current === ","
            )
                delay = 70;


            if (
                current === "!"
            )
                delay = 140;


            if (
                current === "?"
            )
                delay = 120;


            setTimeout(
                next,
                delay
            );

        }


        next();

    }


    gift.addEventListener(
        "click",
        openGift
    );


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


    Birthday.Gift = {

        open:
            openGift

    };

})();