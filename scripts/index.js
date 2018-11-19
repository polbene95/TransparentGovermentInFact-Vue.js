selectSection("about");
selectSection("history");

function selectSection(section) {
    const div = document.getElementsByClassName(section)[0];
    const button = document.getElementById(section);
    button.addEventListener("click", ev => {
        if (button.value == "hidden") {
            button.value = "shown";
            button.innerHTML = "Read Less";
            div.classList.remove("slideUp");
            div.classList.add("slideDown");
        } else {
            button.value = "hidden";
            button.innerHTML = "Read More";
            div.classList.remove("slideDown");
            div.classList.add("slideUp");
        }
    });

}
