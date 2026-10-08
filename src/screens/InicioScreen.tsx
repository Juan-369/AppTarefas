import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTema } from '../styles/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useDados } from '../context/DadosContext';
import { useFeedback } from '../context/FeedbackContext';
import { cartao, espacos, fontes, raios, tipografia } from '../styles/theme';
import { atrasada, primeiroNome, saudacao } from '../services/utils';
import Logo from '../components/Logo';
import Avatar from '../components/Avatar';
import BotaoIcone from '../components/BotaoIcone';
import BarraProgresso from '../components/BarraProgresso';
import BotaoPrincipal from '../components/BotaoPrincipal';
import CardTarefa from '../components/CardTarefa';
import EstadoVazio from '../components/EstadoVazio';

type Props = NativeStackScreenProps<RootStackParamList, 'Inicio'>;
const ordemPrioridade = { Alta: 0, Média: 1, Baixa: 2 };

function frase(total: number, concluidas: number, pendentes: number) {
  if (total === 0) return 'Sua lista está em branco. Que tal acender a primeira tarefa?';
  if (pendentes === 0) return 'Tudo feito por hoje. Você merece um café ☕';
  if (concluidas === 0) return 'Respire fundo e escolha por onde começar.';
  return 'Você está indo bem. Falta pouco para a próxima etapa.';
}

export default function InicioScreen({ navigation }: Props) {
  const { tema, escuro, alternarTema } = useTema();
  const { usuario } = useAuth();
  const { carregando, tarefas, categorias, alternarTarefa } = useDados();
  const { mostrar } = useFeedback();

  if (carregando) {
    return (
      <View style={[styles.centro, { backgroundColor: tema.fundo }]}>
        <ActivityIndicator size="large" color={tema.primaria} />
      </View>
    );
  }

  const total = tarefas.length;
  const concluidas = tarefas.filter((t) => t.concluida).length;
  const pendentes = total - concluidas;
  const vencidas = tarefas.filter((t) => atrasada(t.dataLimite, t.concluida)).length;
  const progresso = total ? concluidas / total : 0;
  const proximas = tarefas
    .filter((t) => !t.concluida)
    .sort((a, b) => ordemPrioridade[a.prioridade] - ordemPrioridade[b.prioridade])
    .slice(0, 3);

  return (
    <SafeAreaView style={[styles.tela, { backgroundColor: tema.fundo }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={styles.topo}>
          <Logo tamanho={34} comNome />
          <View style={styles.topoAcoes}>
            <BotaoIcone
              icone={escuro ? 'sunny-outline' : 'moon-outline'}
              rotulo={escuro ? 'Usar tema claro' : 'Usar tema escuro'}
              onPress={alternarTema}
              tamanho={42}
            />
            <Avatar nome={usuario?.nome ?? '?'} tamanho={42} onPress={() => navigation.navigate('Perfil')} />
          </View>
        </View>

        <View style={styles.saudacao}>
          <View style={styles.eyebrow}>
            <View style={[styles.ponto, { backgroundColor: tema.primaria }]} />
            <Text style={[tipografia.rotulo, { color: tema.textoSuave }]}>
              {saudacao()}, {primeiroNome(usuario?.nome ?? '')}
            </Text>
          </View>
          <Text style={[styles.frase, { color: tema.texto }]}>{frase(total, concluidas, pendentes)}</Text>
        </View>

        <View style={[styles.hero, { backgroundColor: tema.heroFundo }]}>
          <View style={[styles.anel, styles.anelGrande, { borderColor: tema.heroDestaque + '33' }]} />
          <View style={[styles.anel, styles.anelMedio, { borderColor: tema.heroDestaque + '55' }]} />
          <View style={[styles.nucleo, { backgroundColor: tema.heroDestaque }]} />

          <Text style={[tipografia.rotulo, { color: tema.heroSuave }]}>Progresso geral</Text>
          <View style={styles.linhaNumero}>
            <Text style={[styles.numero, { color: tema.heroTexto }]}>{Math.round(progresso * 100)}</Text>
            <Text style={[styles.pct, { color: tema.heroDestaque }]}>%</Text>
          </View>
          <Text style={[styles.resumoDe, { color: tema.heroSuave }]}>{concluidas} de {total} tarefas concluídas</Text>
          <View style={{ marginTop: 16 }}>
            <BarraProgresso progresso={progresso} altura={12} noHero />
          </View>

          <View style={[styles.stats, { borderTopColor: tema.heroTrilha }]}>
            <Stat valor={pendentes} rotulo="A fazer" />
            <Stat valor={concluidas} rotulo="Feitas" separador />
            <Stat valor={vencidas} rotulo="Atrasadas" separador />
          </View>
        </View>

        <View style={styles.secao}>
          <View style={styles.secaoTopo}>
            <Text style={[styles.secaoTitulo, { color: tema.texto }]}>Por onde começar</Text>
            {total > 0 && (
              <TouchableOpacity onPress={() => navigation.navigate('ListaTarefas')} hitSlop={10} accessibilityRole="button" accessibilityLabel="Ver todas as tarefas">
                <Text style={[styles.verTodas, { color: tema.texto }]}>Ver todas →</Text>
              </TouchableOpacity>
            )}
          </View>
          {proximas.length === 0 ? (
            <EstadoVazio emoji="🌱" titulo="Tudo tranquilo por aqui" texto="Quando você criar tarefas, as mais importantes aparecem aqui." />
          ) : (
            proximas.map((t) => (
              <CardTarefa
                key={t.id}
                tarefa={t}
                categoria={categorias.find((c) => c.id === t.categoriaId)}
                onPress={() => navigation.navigate('DetalhesTarefa', { tarefaId: t.id })}
                onConcluir={() => { alternarTarefa(t.id); mostrar('Tarefa concluída! 🎉'); }}
              />
            ))
          )}
        </View>

        <View style={styles.acoes}>
          <BotaoPrincipal titulo="Nova tarefa" icone="add-circle-outline" onPress={() => navigation.navigate('FormTarefa')} />
          <View style={styles.atalhos}>
            <Atalho icone="list-outline" titulo="Tarefas" detalhe={`${total} no total`} onPress={() => navigation.navigate('ListaTarefas')} />
            <Atalho icone="color-palette-outline" titulo="Categorias" detalhe={`${categorias.length} criadas`} onPress={() => navigation.navigate('Categorias')} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Stat({ valor, rotulo, separador = false }: { valor: number; rotulo: string; separador?: boolean }) {
  const { tema } = useTema();
  return (
    <View style={[styles.stat, separador && { borderLeftWidth: 1, borderLeftColor: tema.heroTrilha }]}>
      <Text style={[styles.statValor, { color: tema.heroTexto }]}>{valor}</Text>
      <Text style={[styles.statRotulo, { color: tema.heroSuave }]}>{rotulo}</Text>
    </View>
  );
}

function Atalho({ icone, titulo, detalhe, onPress }: { icone: keyof typeof Ionicons.glyphMap; titulo: string; detalhe: string; onPress: () => void }) {
  const { tema } = useTema();
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${titulo}, ${detalhe}`}
      style={[styles.atalho, cartao(tema)]}
    >
      <View style={[styles.atalhoIcone, { backgroundColor: tema.primaria + '24' }]}>
        <Ionicons name={icone} size={22} color={tema.primaria} />
      </View>
      <Text style={[styles.atalhoTitulo, { color: tema.texto }]}>{titulo}</Text>
      <Text style={[styles.atalhoDetalhe, { color: tema.textoSuave }]}>{detalhe}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1 },
  centro: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  topo: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: espacos.md, paddingTop: espacos.sm, paddingBottom: espacos.md },
  topoAcoes: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  saudacao: { paddingHorizontal: espacos.md, marginBottom: 20 },
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 8 },
  ponto: { width: 7, height: 7, borderRadius: 4 },
  frase: { ...tipografia.display, fontSize: 27, lineHeight: 33, letterSpacing: -0.5 },
  hero: { marginHorizontal: espacos.md, borderRadius: raios.xl, padding: 22, overflow: 'hidden' },
  anel: { position: 'absolute', borderWidth: 1.5 },
  anelGrande: { right: -90, top: -90, width: 240, height: 240, borderRadius: 120 },
  anelMedio: { right: -50, top: -50, width: 160, height: 160, borderRadius: 80 },
  nucleo: { position: 'absolute', right: 20, top: 20, width: 12, height: 12, borderRadius: 6 },
  linhaNumero: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 6 },
  numero: { ...tipografia.display, fontSize: 64, lineHeight: 68, letterSpacing: -2 },
  pct: { ...tipografia.display, fontSize: 26, marginTop: 8, marginLeft: 3 },
  resumoDe: { fontFamily: fontes.bold, fontSize: 14.5, marginTop: 2 },
  stats: { flexDirection: 'row', marginTop: 20, paddingTop: 16, borderTopWidth: 1 },
  stat: { flex: 1, alignItems: 'center' },
  statValor: { ...tipografia.display, fontSize: 24 },
  statRotulo: { fontFamily: fontes.bold, fontSize: 12.5, marginTop: 1 },
  secao: { paddingHorizontal: espacos.md, marginTop: 32 },
  secaoTopo: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 14 },
  secaoTitulo: { ...tipografia.display, fontSize: 22, letterSpacing: -0.3 },
  verTodas: { fontFamily: fontes.extra, fontSize: 14, textDecorationLine: 'underline' },
  acoes: { paddingHorizontal: espacos.md, gap: 12, marginTop: 8 },
  atalhos: { flexDirection: 'row', gap: 12 },
  atalho: { flex: 1, padding: 16, gap: 2 },
  atalhoIcone: { width: 42, height: 42, borderRadius: raios.md, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  atalhoTitulo: { fontFamily: fontes.extra, fontSize: 16 },
  atalhoDetalhe: { fontFamily: fontes.medio, fontSize: 13 },
});
