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

const updateCreateButton = () => {
    const createName = document.getElementById("create-name").value;
    const createGameBtn = document.getElementById("create-game-btn");
    if (createName.length >= 2 && createName.length <= 15) {
        createGameBtn.removeAttribute("disabled");
    } else {
        createGameBtn.setAttribute("disabled", "true");
    }
};

const updateJoinButton = () => {
    const joinName = document.getElementById("join-name").value;
    const joinCode = document.getElementById("join-code").value;
    const joinGameBtn = document.getElementById("join-game-btn");
    if (joinName.length >= 2 && joinName.length <= 15 && joinCode.length === 4) {
        joinGameBtn.removeAttribute("disabled");
    } else {
        joinGameBtn.setAttribute("disabled", "true");
    }
};