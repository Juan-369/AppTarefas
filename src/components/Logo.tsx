import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../styles/ThemeContext';
import { fontes } from '../styles/theme';

interface Props {
  tamanho?: number;
  comNome?: boolean;
}

export default function Logo({ tamanho = 40, comNome = false }: Props) {
  const { tema } = useTema();
  const cor = tema.primaria;
  const contraste = tema.heroDestaque;

  return (
    <View style={styles.linha}>
      <View style={[styles.marca, { width: tamanho, height: tamanho, borderRadius: tamanho * 0.28, backgroundColor: cor }]}>
        <View style={[styles.pagina, { width: tamanho * 0.52, height: tamanho * 0.62, borderRadius: tamanho * 0.08, backgroundColor: tema.superficie }]}>
          <View style={[styles.dobra, { borderTopColor: cor }]} />
          <Ionicons name="checkmark" size={tamanho * 0.34} color={contraste} style={{ marginTop: tamanho * 0.12 }} />
        </View>
      </View>
      {comNome && (
        <Text style={[styles.nome, { color: tema.texto, fontSize: tamanho * 0.55 }]}>notoa</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  marca: { alignItems: 'center', justifyContent: 'center' },
  pagina: { alignItems: 'center', justifyContent: 'flex-start', overflow: 'hidden' },
  dobra: { width: 0, height: 0, borderLeftWidth: 6, borderTopWidth: 6, borderLeftColor: 'transparent', position: 'absolute', right: 0, top: 0 },
  nome: { fontFamily: fontes.extra, letterSpacing: -0.4 },
});
