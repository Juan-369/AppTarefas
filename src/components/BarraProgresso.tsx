import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTema } from '../styles/ThemeContext';
import { fontes } from '../styles/theme';

interface Props {
  progresso: number;
  rotulo?: string;
  altura?: number;
  noHero?: boolean;
}

const SEGMENTOS = 16;


export default function BarraProgresso({ progresso, rotulo, altura = 10, noHero = false }: Props) {
  const { tema } = useTema();
  const pct = Math.max(0, Math.min(1, progresso));
  let acesos = Math.round(pct * SEGMENTOS);
  if (pct > 0 && acesos === 0) acesos = 1;
  if (pct < 1 && acesos === SEGMENTOS) acesos = SEGMENTOS - 1;

  const corAceso = noHero ? tema.heroDestaque : tema.primaria;
  const corApagado = noHero ? tema.heroTrilha : tema.borda;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={rotulo ?? 'Progresso'}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct * 100) }}
    >
      {rotulo ? <Text style={[styles.rotulo, { color: tema.textoSuave }]}>{rotulo}</Text> : null}
      <View style={styles.linha}>
        {Array.from({ length: SEGMENTOS }, (_, i) => (
          <View
            key={i}
            style={{ flex: 1, height: altura, borderRadius: 3, backgroundColor: i < acesos ? corAceso : corApagado }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rotulo: { fontFamily: fontes.medio, fontSize: 13, marginBottom: 8 },
  linha: { flexDirection: 'row', gap: 3 },
});
