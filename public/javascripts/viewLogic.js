/**
 * Changes display of all content elements to none
 */
const hideAll = () => {
    let hide = Array.from(document.getElementsByClassName("content-container"));
    hide.forEach(el => el.style.display = "none");
};

/**
 * Changes from landing page view to creating game view
 */
const createGameView = () => {
    hideAll();
    let toShow = document.getElementById("create-game-container");
    toShow.style.display = "flex";
};

/**
 * Changes from landing page view to joining game view
 */
const joinGameView = () => {
    hideAll();
    let toShow = document.getElementById("join-game-container");
    toShow.style.display = "flex";
};

/**
 * Changes from creating or joining game view to landing view
 */
const toHomeView = () => {
    hideAll();
    let toShow = document.getElementById("landing-container");
    toShow.style.display = "flex";
}

/**
 * Changes to the view of the game lobby
 */
const toLobbyView = () => {
    hideAll();
    let toShow = document.getElementById("game-lobby-container");
    toShow.style.display = "block";
};