import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTema } from '../styles/ThemeContext';
import { useDados } from '../context/DadosContext';
import { useFeedback } from '../context/FeedbackContext';
import { cartao, coresPrioridade, fontes, raios, tipografia } from '../styles/theme';
import { atrasada } from '../services/utils';
import { progressoSubtarefas } from '../services/tarefaService';
import Header from '../components/Header';
import ChipCategoria from '../components/ChipCategoria';
import BarraProgresso from '../components/BarraProgresso';
import BotaoPrincipal from '../components/BotaoPrincipal';
import CampoFormulario from '../components/CampoFormulario';

type Props = NativeStackScreenProps<RootStackParamList, 'DetalhesTarefa'>;

export default function DetalhesTarefaScreen({ navigation, route }: Props) {
  const { tema } = useTema();
  const { tarefas, categorias, subtarefas, alternarTarefa, excluirTarefa, adicionarSubtarefa, alternarSubtarefa, excluirSubtarefa } = useDados();
  const { mostrar, confirmar } = useFeedback();
  const [novaSub, setNovaSub] = useState('');
  const [erroSub, setErroSub] = useState('');

  const tarefa = tarefas.find((t) => t.id === route.params.tarefaId);
  if (!tarefa) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: tema.fundo }}>
        <Header titulo="Tarefa não encontrada" onVoltar={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const categoria = categorias.find((c) => c.id === tarefa.categoriaId);
  const cor = categoria?.cor ?? tema.primaria;
  const subs = subtarefas.filter((s) => s.tarefaId === tarefa.id);
  const vencida = atrasada(tarefa.dataLimite, tarefa.concluida);

  const addSub = async () => {
    if (!novaSub.trim()) {
      setErroSub('Digite o nome da etapa.');
      return;
    }
    setErroSub('');
    await adicionarSubtarefa(tarefa.id, novaSub);
    setNovaSub('');
    mostrar('Etapa adicionada');
  };

  const excluir = async () => {
    const ok = await confirmar({
      titulo: 'Excluir tarefa?',
      mensagem: 'Essa ação também apaga as etapas e não pode ser desfeita.',
      textoConfirmar: 'Excluir',
      perigo: true,
    });
    if (!ok) return;

    navigation.goBack();
    await excluirTarefa(tarefa.id);
    mostrar('Tarefa excluída', 'info');
  };

  const alternar = () => {
    alternarTarefa(tarefa.id);
    if (tarefa.concluida) mostrar('Tarefa reaberta', 'info');
    else mostrar('Tarefa concluída! 🎉');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.fundo }}>
      <Header
        subtitulo="Detalhes"
        titulo="Sua tarefa"
        onVoltar={() => navigation.goBack()}
        acoes={[{ icone: 'create-outline', rotulo: 'Editar tarefa', onPress: () => navigation.navigate('FormTarefa', { tarefaId: tarefa.id }) }]}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 48 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={[styles.card, cartao(tema)]}>
          <View style={[styles.faixa, { backgroundColor: cor }]} />
          <Text style={[styles.titulo, { color: tema.texto }, tarefa.concluida && styles.riscado]}>{tarefa.titulo}</Text>
          <View style={styles.linha}>
            {categoria && <ChipCategoria suave texto={categoria.nome} cor={categoria.cor} />}
            <ChipCategoria suave texto={`Prioridade ${tarefa.prioridade}`} cor={coresPrioridade[tarefa.prioridade]} />
          </View>
          {tarefa.descricao ? <Text style={[styles.desc, { color: tema.textoSuave }]}>{tarefa.descricao}</Text> : null}

          <View style={[styles.infos, { borderTopColor: tema.borda }]}>
            <View style={styles.info}>
              <Text style={[tipografia.rotulo, { color: tema.textoSuave }]}>Prazo</Text>
              <View style={styles.infoLinha}>
                <Ionicons name="calendar-outline" size={17} color={vencida ? tema.erro : tema.texto} />
                <Text style={[styles.infoTxt, { color: vencida ? tema.erro : tema.texto }]}>{tarefa.dataLimite || 'Sem data'}</Text>
              </View>
            </View>
            <View style={styles.info}>
              <Text style={[tipografia.rotulo, { color: tema.textoSuave }]}>Status</Text>
              <View style={styles.infoLinha}>
                <Ionicons
                  name={tarefa.concluida ? 'checkmark-circle' : vencida ? 'alert-circle' : 'time-outline'}
                  size={17}
                  color={tarefa.concluida ? tema.sucesso : vencida ? tema.erro : tema.primaria}
                />
                <Text style={[styles.infoTxt, { color: tema.texto }]}>{tarefa.concluida ? 'Concluída' : vencida ? 'Atrasada' : 'Pendente'}</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={[styles.secao, { color: tema.texto }]}>Passo a passo</Text>
        {subs.length > 0 && (
          <BarraProgresso progresso={progressoSubtarefas(subs)} rotulo={`${subs.filter((s) => s.concluida).length} de ${subs.length} etapas feitas`} />
        )}

        <View style={{ marginTop: 12 }}>
          {subs.length === 0 && (
            <Text style={[styles.vazio, { color: tema.textoSuave }]}>Divida a tarefa em etapas menores para ficar mais fácil de começar.</Text>
          )}
          {subs.map((s) => (
            <View key={s.id} style={[styles.sub, cartao(tema)]}>
              <TouchableOpacity
                onPress={() => alternarSubtarefa(s.id)}
                hitSlop={8}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: s.concluida }}
                accessibilityLabel={s.titulo}
              >
                <Ionicons name={s.concluida ? 'checkmark-circle' : 'ellipse-outline'} size={26} color={s.concluida ? tema.sucesso : tema.textoSuave} />
              </TouchableOpacity>
              <Text style={[styles.subTxt, { color: tema.texto }, s.concluida && styles.riscado]}>{s.titulo}</Text>
              <TouchableOpacity
                onPress={() => { excluirSubtarefa(s.id); mostrar('Etapa removida', 'info'); }}
                hitSlop={8}
                accessibilityRole="button"
                accessibilityLabel={`Remover etapa ${s.titulo}`}
              >
                <Ionicons name="close" size={22} color={tema.textoSuave} />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 14 }}>
          <CampoFormulario rotulo="Nova etapa" placeholder="Ex.: Resolver a lista 1" value={novaSub} onChangeText={setNovaSub} erro={erroSub} onSubmitEditing={addSub} returnKeyType="done" />
          <BotaoPrincipal titulo="Adicionar etapa" variante="secundario" icone="add" onPress={addSub} />
        </View>

        <View style={{ marginTop: 28, gap: 12 }}>
          <BotaoPrincipal titulo={tarefa.concluida ? 'Reabrir tarefa' : 'Marcar como concluída'} icone="checkmark-done" onPress={alternar} />
          <BotaoPrincipal titulo="Excluir tarefa" variante="perigo" icone="trash-outline" onPress={excluir} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  card: { padding: 22, paddingTop: 28, gap: 14, overflow: 'hidden' },
  faixa: { position: 'absolute', left: 0, right: 0, top: 0, height: 6 },
  titulo: { ...tipografia.display, fontSize: 27, lineHeight: 33, letterSpacing: -0.5 },
  riscado: { textDecorationLine: 'line-through', opacity: 0.45 },
  linha: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  desc: { fontFamily: fontes.regular, fontSize: 15.5, lineHeight: 23 },
  infos: { flexDirection: 'row', gap: 16, borderTopWidth: 1, paddingTop: 16, marginTop: 2 },
  info: { flex: 1, gap: 6 },
  infoLinha: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  infoTxt: { fontFamily: fontes.bold, fontSize: 15 },
  secao: { ...tipografia.display, fontSize: 22, marginTop: 30, marginBottom: 12 },
  vazio: { fontFamily: fontes.regular, fontSize: 14.5, lineHeight: 21, marginBottom: 6 },
  sub: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: raios.md, marginBottom: 8 },
  subTxt: { flex: 1, fontFamily: fontes.medio, fontSize: 15.5 },
});
