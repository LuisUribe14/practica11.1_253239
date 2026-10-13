import estilos from './contador-cantidad.css?inline';

export class ContadorCantidad extends HTMLElement {

  static observedAttributes = [
    'valor',
    'minimo',
    'maximo'
  ];

  private valorActual = 1;

  constructor() {
    super();

    const sombra = this.attachShadow({ mode: 'open' });

    sombra.innerHTML = `
      <style>${estilos}</style>

      <div class="contador">
        <button class="menos">-</button>

        <span class="valor">1</span>

        <button class="mas">+</button>
      </div>
    `;
  }

  connectedCallback() {
    this.actualizarDesdeAtributos();

    const botonMenos =
      this.shadowRoot!.querySelector<HTMLButtonElement>('.menos')!;

    const botonMas =
      this.shadowRoot!.querySelector<HTMLButtonElement>('.mas')!;

    botonMenos.addEventListener('click', () => {
      this.disminuir();
    });

    botonMas.addEventListener('click', () => {
      this.aumentar();
    });
  }

  attributeChangedCallback() {
    this.actualizarDesdeAtributos();
  }

  private actualizarDesdeAtributos() {

    const valor =
      Number(this.getAttribute('valor') ?? 1);

    const minimo =
      Number(this.getAttribute('minimo') ?? 1);

    const maximo =
      Number(this.getAttribute('maximo') ?? 10);

    if (valor < minimo) {
      this.valorActual = minimo;
    } else if (valor > maximo) {
      this.valorActual = maximo;
    } else {
      this.valorActual = valor;
    }

    this.actualizarVista();
  }

  private aumentar() {

    const maximo =
      Number(this.getAttribute('maximo') ?? 10);

    if (this.valorActual < maximo) {

      this.valorActual++;

      this.actualizarVista();

      this.avisarCambio();
    }
  }

  private disminuir() {

    const minimo =
      Number(this.getAttribute('minimo') ?? 1);

    if (this.valorActual > minimo) {

      this.valorActual--;

      this.actualizarVista();

      this.avisarCambio();
    }
  }

  private actualizarVista() {

    const valor =
      this.shadowRoot!.querySelector<HTMLElement>('.valor')!;

    valor.textContent =
      String(this.valorActual);

    const botonMenos =
      this.shadowRoot!.querySelector<HTMLButtonElement>('.menos')!;

    const botonMas =
      this.shadowRoot!.querySelector<HTMLButtonElement>('.mas')!;

    const minimo =
      Number(this.getAttribute('minimo') ?? 1);

    const maximo =
      Number(this.getAttribute('maximo') ?? 10);

    botonMenos.disabled =
      this.valorActual <= minimo;

    botonMas.disabled =
      this.valorActual >= maximo;
  }

  private avisarCambio() {

    this.dispatchEvent(
      new CustomEvent('cambio-cantidad', {
        detail: {
          valor: this.valorActual
        },
        bubbles: true,
        composed: true
      })
    );
  }
}

customElements.define(
  'contador-cantidad',
  ContadorCantidad
);