/**
 * Changes from landing page view to creating game view
 */
const createGameView = () => {
    let toHide = document.getElementById("landingContainer");
    let toShow = document.getElementById("createGameContainer");
    toHide.style.display = "none";
    toShow.style.display = "block";
};

/**
 * Changes from landing page view to joining game view
 */
const joinGameView = () => {
    let toHide = document.getElementById("landingContainer");
    let toShow = document.getElementById("joinGameContainer");
    toHide.style.display = "none";
    toShow.style.display = "block";
};

/**
 * Changes from creating or joining game view to landing view
 */
const toHomeView = () => {
    let toHide = document.getElementsByClassName("hidden");
    let toShow = document.getElementById("landingContainer");
    for (let i = 0; i < toHide.length; i++) {
        toHide[i].style.display = "none";
    }
    toShow.style.display = "flex";
}