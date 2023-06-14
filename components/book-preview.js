const template = document.createElement("template");

template.innerHTML = `
<button class="preview" data-preview></button>
        <img
            class="preview__image"
            src="${image}"
        />
        <div class="preview__info">
            <h3 class="preview__title">${title}</h3>
            <div class="preview__author">${authors[author]}</div>
        </div>

`;

customElements.define('book-preview',
        class extends HTMLElement {
            constructor() {
                super();
                const preview = document.getElementById("template");
                let mypreview = preview.contentEditable;

                const shadowRoot = this.attachShadow({mode: 'open'}).appendChild(mypreview.cloneNode(true));
            }
        });