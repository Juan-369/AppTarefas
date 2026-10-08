import { Platform, TextStyle, ViewStyle } from 'react-native';

export const paletaCategorias = [
  '#4F6BFF', '#20B39A', '#7C5CFC', '#3AA6D8', '#D85C8B', '#5F8DFF', '#35B7C8',
];

export const temaClaro = {
  fundo: '#F6F8FC',
  superficie: '#FFFFFF',
  superficieAlt: '#EEF2F8',
  texto: '#172033',
  textoSuave: '#657086',
  borda: '#DCE3EE',
  primaria: '#4F6BFF',
  textoSobrePrimaria: '#FFFFFF',
  sucesso: '#20A67A',
  erro: '#D94B61',
  heroFundo: '#EAF0FF',
  heroTexto: '#172033',
  heroSuave: '#62708A',
  heroDestaque: '#20B39A',
  heroTrilha: '#D2DAEE',
};

export const temaEscuro: typeof temaClaro = {
  fundo: '#0B1020',
  superficie: '#121A2B',
  superficieAlt: '#192338',
  texto: '#F2F5FB',
  textoSuave: '#9CA9BF',
  borda: '#26334B',
  primaria: '#7187FF',
  textoSobrePrimaria: '#FFFFFF',
  sucesso: '#36C89B',
  erro: '#F07183',
  heroFundo: '#16223B',
  heroTexto: '#F2F5FB',
  heroSuave: '#9CA9BF',
  heroDestaque: '#35C6AD',
  heroTrilha: '#2A3B5A',
};

export type Tema = typeof temaClaro;

export const espacos = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const raios = { sm: 8, md: 12, lg: 16, xl: 22, pill: 999 };
export const coresPrioridade = { Baixa: '#20A67A', Média: '#4F6BFF', Alta: '#D94B61' };

export const fontes = {
  regular: 'Nunito_400Regular',
  medio: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extra: 'Nunito_800ExtraBold',
};

const serifa = Platform.select<TextStyle>({
  ios: { fontFamily: 'Georgia-Bold' },
  android: { fontFamily: 'serif', fontWeight: '700' },
  default: { fontFamily: 'Georgia, "Times New Roman", serif', fontWeight: '700' },
});

export const tipografia = {
  display: serifa,
  rotulo: {
    fontFamily: fontes.extra,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  } as TextStyle,
};

export const brilho = (cor: string, forca = 0.25): ViewStyle =>
  Platform.select<ViewStyle>({
    ios: { shadowColor: cor, shadowOpacity: forca, shadowRadius: 14, shadowOffset: { width: 0, height: 4 } },
    default: {},
  });

export const cartao = (tema: Tema): ViewStyle => ({
  backgroundColor: tema.superficie,
  borderColor: tema.borda,
  borderWidth: 1,
  borderRadius: raios.lg,
});
