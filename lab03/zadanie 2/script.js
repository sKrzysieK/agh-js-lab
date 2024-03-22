const pageContent = [
  "Natenczas Wojski chwycił na taśmie przypięty Swój róg bawoli, długi, cętkowany, kręty Jak wąż boa, oburącz do ust go przycisnął, Wzdął policzki jak banię, w oczach krwią zabłysnął, Zasunął wpół powieki, wciągnął w głąb pół brzucha I do płuc wysłał z niego cały zapas ducha, I zagrał: róg jak wicher, wirowatym dechem Niesie w puszczę muzykę i podwaja echem.",
  "Umilkli strzelcy, stali szczwacze zadziwieni Mocą, czystością, dziwną harmoniją pieni. Starzec cały kunszt, którym niegdyś w lasach słynął, Jeszcze raz przed uszami myśliwców rozwinął; Napełnił wnet, ożywił knieje i dąbrowy, Jakby psiarnię w nie wpuścił i rozpoczął łowy.",
  "Bo w graniu była łowów historyja krótka: Zrazu odzew dźwięczący, rześki: to pobudka; Potem jęki po jękach skomlą: to psów granie; A gdzieniegdzie ton twardszy jak grzmot: to strzelanie.",
];

let currIndex = 0;
let isSet = false;

const setAction = () => {
  if (isSet) return;
  console.log("SET");
  Array.from(document.body.children).forEach((node) => {
    if (node.localName === "script") return;
    node.style.border = "1px solid black";
    node.style.margin = "10px 0px";
    node.style["-webkit-box-shadow"] = "0px 0px 5px 2px rgba(190, 237, 237, 1)";
    node.style["-moz-box-shadow"] = "0px 0px 5px 2px rgba(190, 237, 237, 1)";
    node.style.boxShadow = "0px 0px 5px 2px rgba(190, 237, 237, 1)";
    node.style.boxSizing = "border-box";

    if (node.localName === "header") {
      node.classList.add("header");
      node.classList.add("azure");
    }
    if (node.localName === "nav") {
      node.classList.add("nav");
      node.classList.add("azure");
    }

    if (node.localName === "aside") {
      node.classList.add("aside");
      node.classList.add("azure");
    }

    if (node.localName === "main") {
      node.classList.add("main");
      node.classList.add("azure");
    }

    if (node.localName === "footer") {
      node.classList.add("footer");
      node.classList.add("azure");
    }
    isSet = true;
  });

  document
    .querySelectorAll("h1")
    .forEach((h1) => h1.classList.add("animate-color"));
};
const deleteAction = () => {
  if (!isSet) return;
  console.log("DELETE");
  Array.from(document.body.children).forEach((node) => {
    if (node.localName === "script") return;
    node.style.border = "";
    node.style.margin = "";
    node.style["-webkit-box-shadow"] = "";
    node.style["-moz-box-shadow"] = "";
    node.style.boxShadow = "";
    node.style.boxSizing = "";

    if (node.localName === "header") {
      node.classList.remove("header");
      node.classList.remove("azure");
    }
    if (node.localName === "nav") {
      node.classList.remove("nav");
      node.classList.remove("azure");
    }

    if (node.localName === "aside") {
      node.classList.remove("aside");
      node.classList.remove("azure");
    }

    if (node.localName === "main") {
      node.classList.remove("main");
      node.classList.remove("azure");
    }

    if (node.localName === "footer") {
      node.classList.remove("footer");
      node.classList.remove("azure");
    }
    isSet = false;
  });

  document
    .querySelectorAll("h1")
    .forEach((h1) => h1.classList.remove("animate-color"));
};
const addAction = () => {
  if (currIndex > pageContent.length - 1) {
    document.querySelector(".addBtn").disabled = "true";
    return;
  }
  console.log("ADD");
  const newElement = document.createElement("p");
  newElement.textContent = pageContent[currIndex];
  document.querySelector("blockquote").appendChild(newElement);
  currIndex++;
};
