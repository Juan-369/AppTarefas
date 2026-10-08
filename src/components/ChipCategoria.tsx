import React from 'react';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useTema } from '../styles/ThemeContext';
import { fontes, raios } from '../styles/theme';
import { corTextoSobre } from '../services/utils';

interface Props {
  texto: string;
  cor: string;
  selecionado?: boolean;
  suave?: boolean;
  onPress?: () => void;
}

export default function ChipCategoria({ texto, cor, selecionado = true, suave = false, onPress }: Props) {
  const { tema } = useTema();
  const solido = !suave && selecionado;
  const fundo = suave ? cor + '22' : solido ? cor : 'transparent';
  const borda = suave ? 'transparent' : solido ? cor : tema.borda;
  const corTexto = solido ? corTextoSobre(cor) : tema.texto;

  const conteudo = (
    <View style={[styles.chip, { backgroundColor: fundo, borderColor: borda }]}>
      {!solido && <View style={[styles.ponto, { backgroundColor: cor }]} />}
      <Text style={[styles.texto, { color: corTexto }]}>{texto}</Text>
    </View>
  );

  if (!onPress) return conteudo;
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={texto}
      accessibilityState={{ selected: selecionado }}
    >
      {conteudo}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 7, borderRadius: raios.sm, borderWidth: 1.5 },
  ponto: { width: 7, height: 7, borderRadius: 4, marginRight: 7 },
  texto: { fontFamily: fontes.bold, fontSize: 13 },
});
