import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTema } from '../styles/ThemeContext';
import { fontes, tipografia } from '../styles/theme';

interface Props {
  emoji?: string;
  titulo: string;
  texto: string;
}

export default function EstadoVazio({ emoji = '✨', titulo, texto }: Props) {
  const { tema } = useTema();
  return (
    <View style={styles.box}>
      <View style={[styles.anel, { borderColor: tema.primaria + '66' }]}>
        <View style={[styles.circulo, { backgroundColor: tema.superficieAlt }]}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
      </View>
      <Text style={[styles.titulo, { color: tema.texto }]}>{titulo}</Text>
      <Text style={[styles.texto, { color: tema.textoSuave }]}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 32 },
  anel: { width: 112, height: 112, borderRadius: 56, borderWidth: 1.5, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  circulo: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 36 },
  titulo: { ...tipografia.display, fontSize: 20, marginBottom: 6, textAlign: 'center' },
  texto: { fontFamily: fontes.regular, fontSize: 15, textAlign: 'center', lineHeight: 22 },
});
