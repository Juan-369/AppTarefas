import React, { useState } from 'react';
import { View, Text, FlatList, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTema } from '../styles/ThemeContext';
import { useDados } from '../context/DadosContext';
import { useFeedback } from '../context/FeedbackContext';
import { brilho, fontes, raios } from '../styles/theme';
import { Tarefa } from '../types';
import Header from '../components/Header';
import Abas from '../components/Abas';
import CardTarefa from '../components/CardTarefa';
import ChipCategoria from '../components/ChipCategoria';
import EstadoVazio from '../components/EstadoVazio';

type Props = NativeStackScreenProps<RootStackParamList, 'ListaTarefas'>;
const STATUS = ['Todas', 'Pendentes', 'Concluídas'] as const;
type Status = (typeof STATUS)[number];

export default function ListaTarefasScreen({ navigation, route }: Props) {
  const { tema } = useTema();
  const { tarefas, categorias, alternarTarefa, excluirTarefa, limparConcluidas } = useDados();
  const { mostrar, confirmar } = useFeedback();
  const [status, setStatus] = useState<Status>('Todas');
  const [categoriaId, setCategoriaId] = useState<number | null>(route.params?.categoriaId ?? null);

  const filtradas = tarefas.filter((t) => {
    if (status === 'Pendentes' && t.concluida) return false;
    if (status === 'Concluídas' && !t.concluida) return false;
    if (categoriaId !== null && t.categoriaId !== categoriaId) return false;
    return true;
  });
  const qtdConcluidas = tarefas.filter((t) => t.concluida).length;

  async function excluir(t: Tarefa) {
    const ok = await confirmar({
      titulo: 'Excluir tarefa?',
      mensagem: `"${t.titulo}" e suas subtarefas serão apagadas.`,
      textoConfirmar: 'Excluir',
      perigo: true,
    });
    if (!ok) return;
    await excluirTarefa(t.id);
    mostrar('Tarefa excluída', 'info');
  }

  async function limpar() {
    const ok = await confirmar({
      titulo: 'Limpar concluídas?',
      mensagem: `${qtdConcluidas} tarefa(s) concluída(s) serão apagadas de uma vez.`,
      textoConfirmar: 'Limpar',
      perigo: true,
    });
    if (!ok) return;
    await limparConcluidas();
    mostrar(`${qtdConcluidas} tarefa(s) removida(s)`, 'info');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.fundo }}>
      <Header titulo="Minhas tarefas" subtitulo={`${filtradas.length} por aqui`} onVoltar={() => navigation.goBack()} />

      <Abas opcoes={STATUS} valor={status} onChange={setStatus} />

      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtros}>
          <ChipCategoria texto="Todas as categorias" cor={tema.textoSuave} selecionado={categoriaId === null} onPress={() => setCategoriaId(null)} />
          {categorias.map((c) => (
            <ChipCategoria key={c.id} texto={c.nome} cor={c.cor} selecionado={categoriaId === c.id} onPress={() => setCategoriaId(c.id)} />
          ))}
        </ScrollView>
      </View>

      {qtdConcluidas > 0 && (
        <TouchableOpacity
          onPress={limpar}
          accessibilityRole="button"
          accessibilityLabel={`Limpar ${qtdConcluidas} tarefas concluídas`}
          style={[styles.limpar, { borderColor: tema.erro }]}
        >
          <Ionicons name="trash-bin-outline" size={16} color={tema.erro} />
          <Text style={[styles.limparTxt, { color: tema.erro }]}>Limpar concluídas ({qtdConcluidas})</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={filtradas}
        keyExtractor={(t) => String(t.id)}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EstadoVazio emoji="📝" titulo="Nenhuma tarefa por aqui" texto="Toque no + para criar uma tarefa ou mude os filtros." />
        }
        renderItem={({ item }) => (
          <CardTarefa
            tarefa={item}
            categoria={categorias.find((c) => c.id === item.categoriaId)}
            onPress={() => navigation.navigate('DetalhesTarefa', { tarefaId: item.id })}
            onConcluir={() => { alternarTarefa(item.id); mostrar(item.concluida ? 'Tarefa reaberta' : 'Tarefa concluída! 🎉', item.concluida ? 'info' : 'sucesso'); }}
            onExcluir={() => excluir(item)}
          />
        )}
      />

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate('FormTarefa')}
        accessibilityRole="button"
        accessibilityLabel="Nova tarefa"
        style={[styles.fab, brilho(tema.primaria, 0.55), { backgroundColor: tema.primaria }]}
      >
        <Ionicons name="add" size={32} color={tema.textoSobrePrimaria} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  filtros: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 14 },
  limpar: { flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', marginLeft: 16, paddingHorizontal: 12, paddingVertical: 8, borderRadius: raios.sm, borderWidth: 1.5 },
  limparTxt: { fontFamily: fontes.extra, fontSize: 13 },
  fab: { position: 'absolute', right: 22, bottom: 30, width: 62, height: 62, borderRadius: raios.lg, alignItems: 'center', justifyContent: 'center', elevation: 5 },
});
