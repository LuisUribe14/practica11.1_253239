import estilos from './tabla-generica.css?inline';

export interface ColumnaTabla {
    clave: string;
    titulo: string;
}

export class TablaGenerica extends HTMLElement {

    private _columnas: ColumnaTabla[] = [];
    private _filas: Record<string, unknown>[] = [];

    constructor() {
        super();

        const sombra = this.attachShadow({ mode: 'open' });

        sombra.innerHTML = `
            <style>${estilos}</style>

            <div class="contenedor">
                <table>
                    <thead></thead>
                    <tbody></tbody>
                </table>

                <p class="sin-datos">Sin datos</p>
            </div>
        `;
    }

    set columnas(valor: ColumnaTabla[]) {
        this._columnas = valor;
        this.renderizar();
    }

    get columnas() {
        return this._columnas;
    }

    set filas(valor: Record<string, unknown>[]) {
        this._filas = valor;
        this.renderizar();
    }

    get filas() {
        return this._filas;
    }

    connectedCallback() {
        this.renderizar();
    }

    private renderizar() {

        const thead =
            this.shadowRoot!.querySelector('thead')!;

        const tbody =
            this.shadowRoot!.querySelector('tbody')!;

        const sinDatos =
            this.shadowRoot!.querySelector<HTMLElement>('.sin-datos')!;

        thead.innerHTML = '';
        tbody.innerHTML = '';

        // Encabezados
        const filaEncabezado = document.createElement('tr');

        for (const columna of this._columnas) {

            const th = document.createElement('th');

            th.textContent = columna.titulo;

            filaEncabezado.append(th);
        }

        thead.append(filaEncabezado);

        // Sin datos
        if (this._filas.length === 0) {
            sinDatos.style.display = 'block';
            return;
        }

        sinDatos.style.display = 'none';

        // Filas
        for (const fila of this._filas) {

            const tr = document.createElement('tr');

            for (const columna of this._columnas) {

                const td = document.createElement('td');

                const valor = fila[columna.clave];

                td.textContent =
                    valor !== undefined && valor !== null
                        ? String(valor)
                        : '';

                tr.append(td);
            }

            tbody.append(tr);
        }
    }
}

customElements.define(
    'tabla-generica',
    TablaGenerica
);