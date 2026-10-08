import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../styles/ThemeContext';
import { espacos, tipografia } from '../styles/theme';
import BotaoIcone from './BotaoIcone';

export interface AcaoHeader {
  icone: keyof typeof Ionicons.glyphMap;
  rotulo: string;
  onPress: () => void;
}

interface Props {
  titulo: string;
  subtitulo?: string;
  onVoltar?: () => void;
  acoes?: AcaoHeader[];
}

export default function Header({ titulo, subtitulo, onVoltar, acoes = [] }: Props) {
  const { tema } = useTema();
  return (
    <View style={styles.linha}>
      {onVoltar && <BotaoIcone icone="chevron-back" rotulo="Voltar" onPress={onVoltar} />}
      <View style={styles.textos}>
        {subtitulo ? (
          <View style={styles.eyebrow}>
            <View style={[styles.ponto, { backgroundColor: tema.primaria }]} />
            <Text style={[tipografia.rotulo, { color: tema.textoSuave }]}>{subtitulo}</Text>
          </View>
        ) : null}
        <Text style={[styles.titulo, { color: tema.texto }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>
          {titulo}
        </Text>
      </View>
      {acoes.map((a) => (
        <BotaoIcone key={a.rotulo} icone={a.icone} rotulo={a.rotulo} onPress={a.onPress} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: espacos.md, paddingTop: espacos.sm, paddingBottom: espacos.md, gap: 12 },
  textos: { flex: 1 },
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 3 },
  ponto: { width: 7, height: 7, borderRadius: 4 },
  titulo: { ...tipografia.display, fontSize: 28, letterSpacing: -0.5 },
});
