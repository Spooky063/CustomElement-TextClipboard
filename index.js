const div = document.createElement('template');
div.innerHTML = `
    <style>
        :host { display: inline; font-family: inherit; }
        i[role=button] { cursor: pointer; }
        .icon { widht: 18px; height: 18px; position: absolute; margin: 0 10px;}
        .clipboard__status.fadeOut { opacity: 0 } 
    </style>
    <i clipboard role="button">
        <svg fill="#000" width="24" height="24" viewBox="0 0 24 24" class="icon"><path d="M16 1H4C3 1 2 2 2 3v14h2V3h12V1zm3 4H8C7 5 6 6 6 7v14c0 1 1 2 2 2h11c1 0 2-1 2-2V7c0-1-1-2-2-2zm0 16H8V7h11v14z"></path></svg>
    </i>
    </div>
`;

class Clipboard extends HTMLElement {
    constructor()
    {
        super();

        this.clipboard = this.clipboard.bind(this);
    }

    connectedCallback()
    {
        this.target = (!this.hasAttribute('target')) ? this.previousElementSibling : document.querySelector(this.getAttribute('target'));
        if (this.target === null) {
            console.log(`Attribute "${this.getAttribute('target')}" does not exist.`);
            return false;
        }

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(div.content.cloneNode(true));

        this.clipboardBtn = this.shadowRoot.querySelector('[clipboard]');
        this.clipboardBtn.addEventListener('click', this.clipboard);
    }

    disconnectedCallback()
    {
        this.clipboardBtn.removeEventListener('click', this.clipboard);
    }

    static get observedAttributes()
    {
        return ['target'];
    }

    /**
     * Select text and copy to clipboard.
     */
    clipboard()
    {
        const isInput = ['input', 'textarea']
                .findIndex(v => v === this.target.tagName.toLowerCase());
        const text = (isInput === -1) ? this.target.innerText : this.target.value;
            
        if (isInput === -1) {
            if (window.getSelection) {
                const range = document.createRange();
                range.selectNodeContents(this.target);

                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);
            } else if (window.selection) {
                var range = document.body.createTextRange();
                range.moveToElementText(this.target);
            }
        } else {
            this.target.select()
        }

        // Create custom event to execute code after text selected.
        this.event = new CustomEvent('afterselect', { 
            detail: { 
                text: text 
            },
			bubbles: true,
			cancelable: true
        });

        if (!navigator.clipboard) { 
            return new Promise(resolve => {
                this.dispatchEvent(this.event);
                resolve(document.execCommand('copy'));
            })
        }

        this.dispatchEvent(this.event);
        return navigator.clipboard.writeText(text);
    }
}

customElements.define('text-clipboard', Clipboard);