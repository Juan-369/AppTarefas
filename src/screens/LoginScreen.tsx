import React, { useRef, useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTema } from '../styles/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useFeedback } from '../context/FeedbackContext';
import { fontes, tipografia } from '../styles/theme';
import { validarLogin } from '../services/authService';
import Logo from '../components/Logo';
import CampoFormulario from '../components/CampoFormulario';
import BotaoPrincipal from '../components/BotaoPrincipal';
import FundoNotoa from '../components/FundoNotoa';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { tema } = useTema();
  const { entrar } = useAuth();
  const { mostrar } = useFeedback();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erros, setErros] = useState<{ email?: string; senha?: string }>({});
  const [enviando, setEnviando] = useState(false);
  const refSenha = useRef<TextInput>(null);

  async function enviar() {
    if (enviando) return;
    const e = validarLogin({ email, senha });
    setErros(e);
    if (Object.keys(e).length > 0) {
      mostrar('Confira os campos destacados', 'erro');
      return;
    }
    setEnviando(true);
    const erro = await entrar(email, senha);
    if (erro) {
      setEnviando(false);
      setErros({ senha: erro });
      mostrar(erro, 'erro');
    }

  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: tema.fundo }}>
      <FundoNotoa />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.conteudo} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Logo tamanho={44} comNome />

          <View style={styles.titulos}>
            <View style={styles.eyebrow}>
              <View style={[styles.ponto, { backgroundColor: tema.primaria }]} />
              <Text style={[tipografia.rotulo, { color: tema.textoSuave }]}>Bem-vindo de volta</Text>
            </View>
            <Text style={[styles.titulo, { color: tema.texto }]}>Acenda o seu{'\n'}momento.</Text>
            <Text style={[styles.sub, { color: tema.textoSuave }]}>Entre na sua conta para ver e organizar suas tarefas.</Text>
          </View>

          <CampoFormulario
            rotulo="E-mail"
            icone="mail-outline"
            placeholder="nome@email.com"
            value={email}
            onChangeText={setEmail}
            erro={erros.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => refSenha.current?.focus()}
          />
          <CampoFormulario
            ref={refSenha}
            rotulo="Senha"
            icone="lock-closed-outline"
            placeholder="Sua senha"
            value={senha}
            onChangeText={setSenha}
            erro={erros.senha}
            senha
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={enviar}
          />

          <View style={{ marginTop: 6, gap: 6 }}>
            <BotaoPrincipal titulo="Entrar" icone="log-in-outline" onPress={enviar} carregando={enviando} />
            <View style={styles.rodape}>
              <Text style={[styles.rodapeTxt, { color: tema.textoSuave }]}>Ainda não tem conta?</Text>
              <BotaoPrincipal titulo="Criar conta" variante="link" onPress={() => navigation.navigate('Cadastro')} />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  conteudo: { flexGrow: 1, padding: 24, paddingTop: 20, paddingBottom: 40, justifyContent: 'center' },
  titulos: { marginTop: 44, marginBottom: 30 },
  eyebrow: { flexDirection: 'row', alignItems: 'center', gap: 7, marginBottom: 10 },
  ponto: { width: 7, height: 7, borderRadius: 4 },
  titulo: { ...tipografia.display, fontSize: 40, lineHeight: 46, letterSpacing: -1 },
  sub: { fontFamily: fontes.regular, fontSize: 15.5, lineHeight: 22, marginTop: 12 },
  rodape: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, flexWrap: 'wrap' },
  rodapeTxt: { fontFamily: fontes.medio, fontSize: 14.5 },
});
