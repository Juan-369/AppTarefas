import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Categoria, Tarefa } from '../types';
import { useTema } from '../styles/ThemeContext';
import { cartao, coresPrioridade, fontes, raios } from '../styles/theme';
import { atrasada, corTextoSobre } from '../services/utils';
import ChipCategoria from './ChipCategoria';

interface Props {
  tarefa: Tarefa;
  categoria?: Categoria;
  onPress: () => void;
  onConcluir: () => void;
  onExcluir?: () => void;
}

export default function CardTarefa({ tarefa, categoria, onPress, onConcluir, onExcluir }: Props) {
  const { tema } = useTema();
  const cor = categoria?.cor ?? tema.primaria;
  const vencida = atrasada(tarefa.dataLimite, tarefa.concluida);
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Abrir tarefa ${tarefa.titulo}`}
      style={[styles.card, cartao(tema)]}
    >
      <View style={[styles.faixa, { backgroundColor: cor }]} />

      <TouchableOpacity
        onPress={onConcluir}
        hitSlop={10}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: tarefa.concluida }}
        accessibilityLabel={tarefa.concluida ? 'Reabrir tarefa' : 'Concluir tarefa'}
        style={[styles.check, { borderColor: cor, backgroundColor: tarefa.concluida ? cor : 'transparent' }]}
      >
        {tarefa.concluida && <Ionicons name="checkmark" size={18} color={corTextoSobre(cor)} />}
      </TouchableOpacity>

      <View style={styles.corpo}>
        <Text numberOfLines={2} style={[styles.titulo, { color: tema.texto }, tarefa.concluida && styles.riscado]}>
          {tarefa.titulo}
        </Text>
        <View style={styles.meta}>
          {categoria && <ChipCategoria suave texto={categoria.nome} cor={categoria.cor} />}
          <ChipCategoria suave texto={tarefa.prioridade} cor={coresPrioridade[tarefa.prioridade]} />
          {tarefa.dataLimite ? (
            <View style={styles.dataBox}>
              <Ionicons name="calendar-outline" size={14} color={vencida ? tema.erro : tema.textoSuave} />
              <Text style={[styles.data, { color: vencida ? tema.erro : tema.textoSuave }]}>
                {vencida ? 'Atrasada · ' : ''}{tarefa.dataLimite}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {onExcluir && (
        <TouchableOpacity
          onPress={onExcluir}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Excluir tarefa"
          style={[styles.lixeira, { borderColor: tema.borda }]}
        >
          <Ionicons name="trash-outline" size={18} color={tema.erro} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingRight: 14, paddingLeft: 20, marginBottom: 12, gap: 14, overflow: 'hidden' },
  faixa: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  check: { width: 28, height: 28, borderRadius: 9, borderWidth: 2.5, alignItems: 'center', justifyContent: 'center' },
  corpo: { flex: 1 },
  titulo: { fontFamily: fontes.bold, fontSize: 16.5, marginBottom: 9 },
  riscado: { textDecorationLine: 'line-through', opacity: 0.45 },
  meta: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 8 },
  dataBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  data: { fontFamily: fontes.medio, fontSize: 12.5 },
  lixeira: { width: 36, height: 36, borderRadius: raios.sm + 2, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
});
