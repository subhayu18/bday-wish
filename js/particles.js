/* =========================================================
   AMBIENT PARTICLE ENGINE
========================================================= */

(function () {

    const container =
        document.getElementById("stars");

    if (!container)
        return;

    const count =
        Math.min(
            100,
            Math.floor(
                window.innerWidth / 12
            )
        );

    for (
        let i = 0;
        i < count;
        i++
    ) {

        const star =
            document.createElement("span");

        star.className =
            "star";

        star.style.left =
            Math.random() * 100 + "%";

        star.style.top =
            Math.random() * 100 + "%";

        const size =
            Math.random() * 2.5 + 1;

        star.style.width =
            size + "px";

        star.style.height =
            size + "px";

        star.style.animationDuration =
            1.5 +
            Math.random() * 4 +
            "s";

        star.style.animationDelay =
            -Math.random() * 5 +
            "s";

        container.appendChild(
            star
        );

    }

})();