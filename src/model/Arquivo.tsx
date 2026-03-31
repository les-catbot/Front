export interface Arquivo {
    ativo: any;
    id: string;
    titulo: string;
    categoria: string;
    fonte: string;
    criadoEm: string;
}

export interface ArquivoCreate {
    titulo: string;
    categoria: string;
    fonte: string;
}

export interface ArquivoUpdate {
    id: string;
    titulo?: string;
    categoria?: string;
    fonte?: string;
}

export type ArquivosArray = Array<Arquivo>;