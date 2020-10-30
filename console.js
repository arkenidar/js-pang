export function console_add(text) {
    if (typeof document === "undefined")
        return;
    var console_element = document.getElementById("console");
    console_element.innerText += text;
}
