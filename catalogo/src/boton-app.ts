import estilos from './boton-app.css?inline';

export class BotonApp extends HTMLElement {

    static observedAttributes = ['variante', 'deshabilitado'];

    private boton: HTMLButtonElement;

    constructor() {
        super();

        const sombra = this.attachShadow({ mode: 'open' });

        sombra.innerHTML = `
            <style>${estilos}</style>
            <button>
                <slot></slot>
            </button>
        `;

        this.boton = sombra.querySelector('button')!;
    }

    connectedCallback() {
        this.actualizar();
    }

    attributeChangedCallback() {
        this.actualizar();
    }

    private actualizar() {
        const variante = this.getAttribute('variante') ?? 'secundario';

        this.boton.className = variante;

        this.boton.disabled = this.hasAttribute('deshabilitado');
    }
}

customElements.define('boton-app', BotonApp);