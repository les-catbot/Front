export interface Arquivo {
  ativo: any;
  id: string;
  titulo: string;
  categoria: string;
  fonte: string;
  criadoEm: string;
  versao?: number;
}

export interface ArquivoCreate {
  titulo: string;
  categoria: string;
  fonte: string;
  versao?: number;
}

export interface ArquivoUpdate {
  id: string;
  titulo?: string;
  categoria?: string;
  fonte?: string;
  versao?: number;
}

export type ArquivosArray = Array<Arquivo>;
