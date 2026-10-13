import './boton-app';
import estilos from './tarjeta-producto.css?inline';

export class TarjetaProducto extends HTMLElement {

    static observedAttributes = [
        'producto-id',
        'nombre',
        'precio',
        'imagen',
        'existencia'
    ];

    private productoId = '';
    private nombre = '';
    private precio = 0;
    private imagen = '';
    private existencia = 0;

    constructor() {
        super();

        const sombra = this.attachShadow({ mode: 'open' });

        sombra.innerHTML = `
            <style>${estilos}</style>

            <article class="tarjeta">
                <img class="producto__imagen" src="" alt="">

                <div class="producto__contenido">
                    <h2 class="producto__nombre"></h2>

                    <p class="producto__precio"></p>

                    <p class="producto__existencia"></p>

                    <boton-app class="boton-agregar" variante="primario">
                        Agregar
                    </boton-app>
                </div>
            </article>
        `;
    }

    connectedCallback() {
        this.actualizar();

        const boton =
            this.shadowRoot!.querySelector<HTMLElement>('.boton-agregar')!;

        boton.addEventListener('click', () => {

            if (this.existencia <= 0) {
                return;
            }

            this.dispatchEvent(
                new CustomEvent('agregar', {
                    detail: {
                        id: this.productoId,
                        nombre: this.nombre,
                        precio: this.precio
                    },
                    bubbles: true,
                    composed: true
                })
            );
        });
    }

    attributeChangedCallback() {
        this.actualizar();
    }

    private actualizar() {

        this.productoId =
            this.getAttribute('producto-id') ?? '';

        this.nombre =
            this.getAttribute('nombre') ?? '';

        this.precio =
            Number(this.getAttribute('precio') ?? 0);

        this.imagen =
            this.getAttribute('imagen') ?? '';

        this.existencia =
            Number(this.getAttribute('existencia') ?? 0);

        const imagen =
            this.shadowRoot!.querySelector<HTMLImageElement>(
                '.producto__imagen'
            )!;

        const nombre =
            this.shadowRoot!.querySelector<HTMLElement>(
                '.producto__nombre'
            )!;

        const precio =
            this.shadowRoot!.querySelector<HTMLElement>(
                '.producto__precio'
            )!;

        const existencia =
            this.shadowRoot!.querySelector<HTMLElement>(
                '.producto__existencia'
            )!;

        const boton =
            this.shadowRoot!.querySelector<HTMLElement>(
                '.boton-agregar'
            )!;

        imagen.src = this.imagen;
        imagen.alt = this.nombre;

        nombre.textContent = this.nombre;

        precio.textContent =
            `$${this.precio.toLocaleString('es-MX')}`;

        if (this.existencia <= 0) {
            existencia.textContent = 'Agotado';
            boton.setAttribute('deshabilitado', '');
        } else {
            existencia.textContent =
                `${this.existencia} disponibles`;

            boton.removeAttribute('deshabilitado');
        }
    }
}

customElements.define(
    'tarjeta-producto',
    TarjetaProducto
);