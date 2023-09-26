const colorModeButton = document.querySelector("#color-mode");

const darkModeLS = localStorage.getItem("darkMode");
let darkMode = darkModeLS || false;

if (darkMode) {
    document.body.classList.toggle("dark-mode");
}

colorModeButton.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    darkMode = !darkMode;
    localStorage.setItem("darkMode", darkMode);
})

const urlParams = new URLSearchParams(window.location.search);
const searchParam = urlParams.get('s');

const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${searchParam}`;
const definitionContainer = document.querySelector("#definition-container");


async function searchWord() {
    if (!searchParam) { return }
    definitionContainer.innerHTML = "";
    const response = await fetch(url);
    const words = await response.json();
    
    console.log(words);

    if (words.title) {
        let message = words.message;
        const emojis = ["😢", "😖", "😕", "😔", "🙁", "☹️", "😥", "😣", "🙃", "🫠", "😵‍💫"];
        const emojiAleatorio = Math.floor(Math.random() * emojis.length);

        const div = document.createElement("div");
        div.classList.add("not-found");
        div.innerHTML = `
            <p class="not-found-emoji">${emojis[emojiAleatorio]}</p>
            <p class="not-found-title">No definitions for <i>${searchParam}</i></p>
            <p class="not-found-message">${message}</p>
        `;
        definitionContainer.append(div);
        return
    }

    let word = words[0].word;
    let phonetic = "";
    for (const word of words) {
        if (word.phonetic) {
            phonetic = word.phonetic;
            break;
        }
        for (const phoneticObj of word.phonetics) {
            if (phoneticObj.text) {
                phonetic = phoneticObj.text;
                break;
            }
        }
        if (phonetic) {
            break;
        }
    }

    let audioUrl = undefined;
    for (const word of words) {
        for (const phoneticObj of word.phonetics) {
            if (phoneticObj.audio) {
                audioUrl = phoneticObj.audio;
                break;
            }
        }
        if (audioUrl) {
            break;
        }
    }

    const audioElem = document.createElement("audio");
    audioElem.src = audioUrl;
    const div = document.createElement("div");
    div.innerHTML = `
        <div class="main-word">
            <div>
                <h2 class="main-word-title">${word}</h2>
                <p class="main-word-pronunciation">${phonetic}</p>
            </div>
            <button class="play-button"><i class="bi bi-play-fill"></i></button>
        </div>
    `;
    div.querySelector(".main-word-title").parentNode.appendChild(audioElem);
    div.querySelector(".play-button").addEventListener("click", () => {
        audioElem.play();
    })
    audioElem.addEventListener("play", () => {
        div.querySelector(".play-button").innerHTML = `<i class="bi bi-volume-up"></i>`
    })
    audioElem.addEventListener("pause", () => {
        div.querySelector(".play-button").innerHTML = `<i class="bi bi-play-fill"></i>`
    })

    if (!audioUrl) {div.querySelector(".play-button").style.display = "none"}

    

    if (searchParam.toLowerCase() === "carpi") {
        /** easter egg */
        const carpiDiv = document.createElement("div");
        carpiDiv.innerHTML = `
        <div class="definition">
                        <div class="definition-type">
                            <h3 class="definition-type-title">content creator</h3>
                        </div>
                        <div class="definition-meanings">
                            <h4 class="definition-meanings-title">What does he do</h4>
                            <ul class="definition-meanings-list">
                                <li class="definition-meaning">
                                    <p class="definition-meaning-text">Creates content about web development in his YouTube channel.</p>
                                    <p class="definition-meaning-example">HTML, CSS, JavaScript, React and more</p>
                                </li>
                            </ul>
                        </div>
                        <div class="definition-source">
                            <h4 class="definition-source-title">Source</h4>
                            <a class="definition-source-link" href="https://youtube.com/carpicoder" target="_blank">
                                https://youtube.com/carpicoder
                                <i class="bi bi-box-arrow-up-right"></i>
                            </a>
                        </div>
                    </div>`
        div.append(carpiDiv);
    }

    const definitions = document.createElement("div");
    definitions.classList.add("definitions");
    words.forEach((word) => {
        definitions.innerHTML += `
            ${
                word.meanings.map(meaning => {
                return `
                <div class="definition">
                    <div class="definition-type">
                        <h3 class="definition-type-title">${meaning.partOfSpeech}</h3>
                    </div>
                    <div class="definition-meanings">
                        <h4 class="definition-meanings-title">Meaning</h4>
                        <ul class="definition-meanings-list">
                            ${
                                meaning.definitions.map(definition => {
                                    return `
                                        <li class="definition-meaning">
                                            <p class="definition-meaning-text">${definition.definition}</p>
                                            ${definition.example ? `<p class="definition-meaning-example">${definition.example}</p>` : ""}
                                        </li>
                                    `
                                }).join('')
                            }
                        </ul>
                    </div>
                    ${
                        meaning.synonyms?.length > 0 ?
                        `
                            <div class="definition-synonyms">
                                <h4 class="definition-synonyms-title">Synonyms</h4>
                                <ul class="definition-synonyms-list">
                                    ${
                                        meaning.synonyms.map(synonym => {
                                            return `
                                                <li><a href="/?s=${synonym}">${synonym}</a></li>
                                            `
                                        }).join('')
                                    }
                                </ul>
                            </div>
                        ` : 
                        ""
                    }
                    ${
                        meaning.antonyms?.length > 0 ?
                        `
                            <div class="definition-synonyms">
                                <h4 class="definition-synonyms-title">Antonyms</h4>
                                <ul class="definition-synonyms-list">
                                    ${
                                        meaning.antonyms.map(antonym => {
                                            return `
                                            <li><a href="/?s=${antonym}">${antonym}</a></li>
                                            `
                                        }).join('')
                                    }
                                </ul>
                            </div>
                        ` : 
                        ""
                    }
                    ${
                        word.sourceUrls && word.sourceUrls[0].length > 0 ?
                        `
                            <div class="definition-source">
                                <h4 class="definition-source-title">Source</h4>
                                <a class="definition-source-link" href="${word.sourceUrls[0]}" target="_blank">
                                    ${word.sourceUrls[0]}
                                    <i class="bi bi-box-arrow-up-right"></i>
                                </a>
                            </div>
                        ` : 
                        ""
                    }
                </div>
                    `
                }).join('')
            }
        `;
    })
    div.append(definitions);
    definitionContainer.append(div);
}
  
searchWord();