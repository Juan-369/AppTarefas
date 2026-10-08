import React from 'react';
import { Text, TouchableOpacity, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../styles/ThemeContext';
import { brilho, fontes, raios } from '../styles/theme';

interface Props {
  titulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario' | 'perigo' | 'link';
  icone?: keyof typeof Ionicons.glyphMap;
  carregando?: boolean;
  style?: ViewStyle;
}

export default function BotaoPrincipal({ titulo, onPress, variante = 'primario', icone, carregando = false, style }: Props) {
  const { tema } = useTema();

  let fundo = 'transparent';
  let cor = tema.texto;
  let borda = 'transparent';
  if (variante === 'primario') {
    fundo = tema.primaria;
    cor = tema.textoSobrePrimaria;
  } else if (variante === 'secundario') {
    borda = tema.borda;
  } else if (variante === 'perigo') {
    fundo = tema.erro + '14';
    cor = tema.erro;
    borda = tema.erro;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={carregando}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: carregando, busy: carregando }}
      style={[
        styles.botao,
        variante === 'primario' && brilho(tema.primaria, 0.4),
        variante === 'link' && styles.link,
        { backgroundColor: fundo, borderColor: borda },
        style,
      ]}
    >
      {carregando ? (
        <ActivityIndicator color={cor} />
      ) : (
        <>
          {icone && <Ionicons name={icone} size={19} color={cor} style={{ marginRight: 8 }} />}
          <Text style={[styles.texto, { color: cor }, variante === 'link' && styles.textoLink]}>{titulo}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  botao: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    minHeight: 54, paddingVertical: 14, paddingHorizontal: 22, borderRadius: raios.md, borderWidth: 1.5,
  },
  link: { minHeight: 44, paddingVertical: 8 },
  texto: { fontFamily: fontes.extra, fontSize: 15.5, letterSpacing: 0.3 },
  textoLink: { textDecorationLine: 'underline' },
});
