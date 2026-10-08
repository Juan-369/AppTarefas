import React, { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { View, Text, Modal, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../styles/ThemeContext';
import { brilho, fontes, raios, tipografia } from '../styles/theme';

type TipoToast = 'sucesso' | 'erro' | 'info';

interface OpcoesConfirmar {
  titulo: string;
  mensagem: string;
  textoConfirmar?: string;
  perigo?: boolean;
}

interface FeedbackCtx {
  mostrar: (mensagem: string, tipo?: TipoToast) => void;
  confirmar: (opcoes: OpcoesConfirmar) => Promise<boolean>;
}

const Ctx = createContext<FeedbackCtx>({ mostrar: () => {}, confirmar: async () => false });

const iconesToast: Record<TipoToast, keyof typeof Ionicons.glyphMap> = {
  sucesso: 'checkmark-circle',
  erro: 'alert-circle',
  info: 'information-circle',
};

export function FeedbackProvider({ children }: { children: ReactNode }) {
  const { tema } = useTema();
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<{ mensagem: string; tipo: TipoToast } | null>(null);
  const [conf, setConf] = useState<(OpcoesConfirmar & { resolver: (v: boolean) => void }) | null>(null);
  const anim = useRef(new Animated.Value(0)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const mostrar = useCallback((mensagem: string, tipo: TipoToast = 'sucesso') => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ mensagem, tipo });
    anim.setValue(0);
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 8 }).start();
    timer.current = setTimeout(() => {
      Animated.timing(anim, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => setToast(null));
    }, 2800);
  }, [anim]);

  const confirmar = useCallback(
    (opcoes: OpcoesConfirmar) => new Promise<boolean>((resolver) => setConf({ ...opcoes, resolver })),
    []
  );

  const fechar = (valor: boolean) => {
    conf?.resolver(valor);
    setConf(null);
  };

  const corToast = toast?.tipo === 'erro' ? tema.erro : toast?.tipo === 'info' ? tema.textoSuave : tema.sucesso;
  const corAcao = conf?.perigo ? tema.erro : tema.primaria;

  return (
    <Ctx.Provider value={{ mostrar, confirmar }}>
      <View style={{ flex: 1 }}>
        {children}

        {toast && (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.toastArea,
              { top: insets.top + 10, opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-90, 0] }) }] },
            ]}
          >
            <View style={[styles.toast, { backgroundColor: tema.superficie, borderColor: tema.borda }]}>
              <View style={[styles.toastBarra, { backgroundColor: corToast }]} />
              <Ionicons name={iconesToast[toast.tipo]} size={22} color={corToast} />
              <Text style={[styles.toastTexto, { color: tema.texto }]}>{toast.mensagem}</Text>
            </View>
          </Animated.View>
        )}
      </View>

      <Modal transparent visible={!!conf} animationType="fade" onRequestClose={() => fechar(false)}>
        <View style={styles.fundo}>
          <View style={[styles.modal, { backgroundColor: tema.superficie, borderColor: tema.borda }]}>
            <View style={[styles.modalFaixa, { backgroundColor: corAcao }]} />
            <Text style={[styles.modalTitulo, { color: tema.texto }]}>{conf?.titulo}</Text>
            <Text style={[styles.modalMsg, { color: tema.textoSuave }]}>{conf?.mensagem}</Text>
            <View style={styles.modalBotoes}>
              <TouchableOpacity
                onPress={() => fechar(false)}
                style={[styles.modalBotao, { borderColor: tema.borda, borderWidth: 1.5 }]}
              >
                <Text style={[styles.modalBotaoTxt, { color: tema.texto }]}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => fechar(true)}
                style={[styles.modalBotao, brilho(corAcao, 0.3), { backgroundColor: corAcao }]}
              >
                <Text style={[styles.modalBotaoTxt, { color: conf?.perigo ? '#FFFFFF' : tema.textoSobrePrimaria }]}>
                  {conf?.textoConfirmar ?? 'Confirmar'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Ctx.Provider>
  );
}

export const useFeedback = () => useContext(Ctx);

const styles = StyleSheet.create({
  toastArea: { position: 'absolute', left: 16, right: 16, alignItems: 'center', zIndex: 999 },
  toast: {
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, paddingRight: 16, paddingLeft: 18,
    borderRadius: raios.md, borderWidth: 1, maxWidth: 480, overflow: 'hidden', elevation: 4,
  },
  toastBarra: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 5 },
  toastTexto: { fontFamily: fontes.bold, fontSize: 14.5, flexShrink: 1 },
  fundo: { flex: 1, backgroundColor: 'rgba(10,9,20,0.6)', alignItems: 'center', justifyContent: 'center', padding: 24 },
  modal: { width: '100%', maxWidth: 380, borderRadius: raios.xl, borderWidth: 1, padding: 24, paddingTop: 30, overflow: 'hidden' },
  modalFaixa: { position: 'absolute', left: 0, right: 0, top: 0, height: 6 },
  modalTitulo: { ...tipografia.display, fontSize: 22, marginBottom: 8 },
  modalMsg: { fontFamily: fontes.regular, fontSize: 15, lineHeight: 22, marginBottom: 22 },
  modalBotoes: { flexDirection: 'row', gap: 10 },
  modalBotao: { flex: 1, paddingVertical: 14, borderRadius: raios.md, alignItems: 'center' },
  modalBotaoTxt: { fontFamily: fontes.extra, fontSize: 15 },
});
