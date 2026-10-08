import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTema } from '../styles/ThemeContext';
import { useDados } from '../context/DadosContext';
import { useFeedback } from '../context/FeedbackContext';
import { cartao, fontes, raios, tipografia } from '../styles/theme';
import { corTextoSobre } from '../services/utils';
import Header from '../components/Header';
import BotaoPrincipal from '../components/BotaoPrincipal';
import EstadoVazio from '../components/EstadoVazio';

type Props = NativeStackScreenProps<RootStackParamList, 'Categorias'>;

export default function CategoriasScreen({ navigation }: Props) {
  const { tema } = useTema();
  const { categorias, tarefas, excluirCategoria } = useDados();
  const { mostrar, confirmar } = useFeedback();

  async function excluir(id: number, nome: string, qtd: number) {
    const ok = await confirmar({
      titulo: `Excluir "${nome}"?`,
      mensagem: qtd > 0 ? `As ${qtd} tarefa(s) dessa categoria também serão apagadas.` : 'Essa categoria será removida.',
      textoConfirmar: 'Excluir',
      perigo: true,
    });
    if (!ok) return;
    await excluirCategoria(id);
    mostrar('Categoria excluída', 'info');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.fundo }}>
      <Header subtitulo={`${categorias.length} cadastrada(s)`} titulo="Categorias" onVoltar={() => navigation.goBack()} />
      <FlatList
        data={categorias}
        keyExtractor={(c) => String(c.id)}
        contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EstadoVazio emoji="🎨" titulo="Nenhuma categoria ainda" texto="Crie uma categoria para agrupar suas tarefas por assunto." />}
        renderItem={({ item }) => {
          const qtd = tarefas.filter((t) => t.categoriaId === item.id).length;
          return (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => navigation.navigate('ListaTarefas', { categoriaId: item.id })}
              accessibilityRole="button"
              accessibilityLabel={`Ver tarefas de ${item.nome}`}
              style={[styles.item, cartao(tema)]}
            >
              <View style={[styles.faixa, { backgroundColor: item.cor }]} />
              <View style={[styles.inicial, { backgroundColor: item.cor }]}>
                <Text style={[styles.inicialTxt, { color: corTextoSobre(item.cor) }]}>{item.nome.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.nome, { color: tema.texto }]}>{item.nome}</Text>
                <Text style={[styles.qtd, { color: tema.textoSuave }]}>
                  {qtd === 0 ? 'Nenhuma tarefa' : qtd === 1 ? '1 tarefa' : `${qtd} tarefas`}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => excluir(item.id, item.nome, qtd)}
                hitSlop={10}
                accessibilityRole="button"
                accessibilityLabel={`Excluir categoria ${item.nome}`}
                style={[styles.lixeira, { borderColor: tema.borda }]}
              >
                <Ionicons name="trash-outline" size={18} color={tema.erro} />
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />
      <View style={{ padding: 16 }}>
        <BotaoPrincipal titulo="Nova categoria" icone="add" onPress={() => navigation.navigate('FormCategoria')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 16, paddingRight: 14, paddingLeft: 20, marginBottom: 12, overflow: 'hidden' },
  faixa: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  inicial: { width: 46, height: 46, borderRadius: raios.md, alignItems: 'center', justifyContent: 'center' },
  inicialTxt: { ...tipografia.display, fontSize: 22 },
  nome: { fontFamily: fontes.extra, fontSize: 17 },
  qtd: { fontFamily: fontes.medio, fontSize: 13.5, marginTop: 2 },
  lixeira: { width: 36, height: 36, borderRadius: raios.sm + 2, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
});
