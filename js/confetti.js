/* =========================================================
   CONFETTI PHYSICS
========================================================= */

(function () {

    const canvas =
        document.getElementById(
            "confetti"
        );

    const ctx =
        canvas.getContext("2d");


    let width;
    let height;
    let dpr;


    const pieces =
        [];


    function resize() {

        dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );

        width =
            window.innerWidth;

        height =
            window.innerHeight;


        canvas.width =
            width * dpr;

        canvas.height =
            height * dpr;


        canvas.style.width =
            width + "px";

        canvas.style.height =
            height + "px";


        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );

    }


    window.addEventListener(
        "resize",
        resize
    );


    resize();


    function burst(
        amount = 500,
        x = width / 2,
        y = height / 2
    ) {

        for (
            let i = 0;
            i < amount;
            i++
        ) {

            const angle =
                Math.random() *
                Math.PI *
                2;


            const speed =
                5 +
                Math.random() *
                22;


            pieces.push({

                x,

                y,

                vx:
                    Math.cos(angle) *
                    speed,

                vy:
                    Math.sin(angle) *
                    speed -
                    8,

                gravity:
                    .22 +
                    Math.random() *
                    .18,

                drag:
                    .985,

                rotation:
                    Math.random() *
                    Math.PI,

                rotationSpeed:
                    (Math.random() - .5) *
                    .35,

                width:
                    4 +
                    Math.random() *
                    9,

                height:
                    7 +
                    Math.random() *
                    15,

                hue:
                    Math.random() *
                    360,

                life:
                    1

            });

        }

    }


    function rain(
        amount = 100
    ) {

        for (
            let i = 0;
            i < amount;
            i++
        ) {

            pieces.push({

                x:
                    Math.random() *
                    width,

                y:
                    -30,

                vx:
                    (Math.random() - .5) *
                    2,

                vy:
                    2 +
                    Math.random() *
                    5,

                gravity:
                    .03,

                drag:
                    .999,

                rotation:
                    Math.random() *
                    Math.PI,

                rotationSpeed:
                    (Math.random() - .5) *
                    .2,

                width:
                    4 +
                    Math.random() *
                    7,

                height:
                    8 +
                    Math.random() *
                    14,

                hue:
                    Math.random() *
                    360,

                life:
                    1

            });

        }

    }


    function animate() {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        for (
            let i =
                pieces.length - 1;
            i >= 0;
            i--
        ) {

            const p =
                pieces[i];


            p.vx *=
                p.drag;

            p.vy +=
                p.gravity;


            p.x +=
                p.vx;

            p.y +=
                p.vy;


            p.rotation +=
                p.rotationSpeed;


            if (
                p.y >
                height + 100
            ) {

                pieces.splice(
                    i,
                    1
                );

                continue;

            }


            ctx.save();


            ctx.translate(
                p.x,
                p.y
            );


            ctx.rotate(
                p.rotation
            );


            ctx.fillStyle =
                `hsl(${p.hue},90%,65%)`;


            ctx.fillRect(
                -p.width / 2,
                -p.height / 2,
                p.width,
                p.height
            );


            ctx.restore();

        }


        requestAnimationFrame(
            animate
        );

    }


    animate();


    Birthday.Confetti = {

        burst,

        rain

    };

})();