import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { ParkColors, ParkRadii, ParkShadows } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';

interface ChatModalProps {
  visible: boolean;
  onClose: () => void;
  hostName: string;
  hostPhoto: string;
}

interface Message {
  id: string;
  sender: 'user' | 'host';
  text: string;
  time: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  visible,
  onClose,
  hostName,
  hostPhoto,
}) => {
  const {
    s,
    vs,
    ms,
    hPad,
    stickyFooterBottomPad,
    formMaxWidth,
  } = useResponsive();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'host',
      text: `Assalam-o-Alaikum! Thanks for booking my space. Automatic gate camera is armed for your arrival.`,
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const quickReplies = [
    'I have reached the gate.',
    'Please buzz the gate open.',
    'Is the EV charger ready?',
  ];

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      time: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    setTimeout(() => {
      const hostReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'host',
        text: `Got it! Gate is unlocked. Slot is right under the shade canopy.`,
        time: 'Just now',
      };
      setMessages((prev) => [...prev, hostReply]);
    }, 1200);
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[styles.container, { maxWidth: formMaxWidth }]}
        >
          {/* Header */}
          <View style={[styles.header, { padding: hPad }]}>
            <View style={[styles.hostInfo, { gap: s(10) }]}>
              <Image
                source={{ uri: hostPhoto }}
                style={[
                  styles.avatar,
                  {
                    width: ms(36),
                    height: ms(36),
                    borderRadius: ms(18),
                  },
                ]}
              />
              <View>
                <View style={styles.nameRow}>
                  <Text style={[styles.hostName, { fontSize: ms(15) }]}>
                    {hostName}
                  </Text>
                  <MaterialIcons
                    name="verified"
                    size={ms(14)}
                    color={ParkColors.secondary}
                  />
                </View>
                <Text style={[styles.onlineStatus, { fontSize: ms(11) }]}>
                  Online • Fast responder
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <MaterialIcons
                name="close"
                size={ms(24)}
                color={ParkColors.textMuted}
              />
            </TouchableOpacity>
          </View>

          {/* Messages Scroll View */}
          <ScrollView
            style={styles.chatScroll}
            contentContainerStyle={[
              styles.chatContent,
              { padding: hPad, gap: vs(12) },
            ]}
          >
            <View style={styles.encryptedBanner}>
              <MaterialIcons
                name="lock"
                size={ms(12)}
                color={ParkColors.textMuted}
              />
              <Text style={[styles.encryptedText, { fontSize: ms(10.5) }]}>
                Encrypted in-app messaging • Host phone is masked
              </Text>
            </View>

            {messages.map((m) => (
              <View
                key={m.id}
                style={[
                  styles.messageBubble,
                  { padding: s(12) },
                  m.sender === 'user' ? styles.userBubble : styles.hostBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    { fontSize: ms(13.5) },
                    m.sender === 'user' ? styles.userText : styles.hostText,
                  ]}
                >
                  {m.text}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    { fontSize: ms(10) },
                    m.sender === 'user' ? styles.userTime : styles.hostTime,
                  ]}
                >
                  {m.time}
                </Text>
              </View>
            ))}
          </ScrollView>

          {/* Quick Reply Chips */}
          <View style={styles.quickReplyContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.quickChips,
                { paddingHorizontal: hPad, gap: s(8) },
              ]}
            >
              {quickReplies.map((qr, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.quickChip,
                    {
                      paddingHorizontal: s(12),
                      paddingVertical: vs(6),
                    },
                  ]}
                  onPress={() => handleSend(qr)}
                >
                  <Text style={[styles.quickChipText, { fontSize: ms(12) }]}>
                    {qr}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Input Row */}
          <View
            style={[
              styles.inputContainer,
              {
                paddingHorizontal: hPad,
                paddingBottom: stickyFooterBottomPad,
                paddingTop: vs(8),
                gap: s(10),
              },
            ]}
          >
            <TextInput
              style={[
                styles.input,
                { height: ms(44), fontSize: ms(14) },
              ]}
              placeholder="Message host..."
              placeholderTextColor={ParkColors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSend()}
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                {
                  width: ms(44),
                  height: ms(44),
                  borderRadius: ms(22),
                },
              ]}
              activeOpacity={0.8}
              onPress={() => handleSend()}
            >
              <MaterialIcons name="send" size={ms(18)} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 37, 69, 0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: ParkRadii.sheet,
    borderTopRightRadius: ParkRadii.sheet,
    height: '78%',
    maxHeight: 640,
    ...ParkShadows.sheet,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: ParkColors.border,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: ParkColors.surfaceHigh,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hostName: {
    fontWeight: '700',
    color: ParkColors.text,
  },
  onlineStatus: {
    color: ParkColors.success,
    fontWeight: '500',
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    width: '100%',
  },
  encryptedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: 9999,
    alignSelf: 'center',
    marginBottom: 8,
  },
  encryptedText: {
    color: ParkColors.textMuted,
  },
  messageBubble: {
    maxWidth: '82%',
    borderRadius: ParkRadii.lg,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: ParkColors.secondary,
    borderBottomRightRadius: 4,
  },
  hostBubble: {
    alignSelf: 'flex-start',
    backgroundColor: ParkColors.surfaceLow,
    borderBottomLeftRadius: 4,
  },
  messageText: {
    lineHeight: 19,
  },
  userText: {
    color: '#FFFFFF',
  },
  hostText: {
    color: ParkColors.text,
  },
  messageTime: {
    marginTop: 4,
  },
  userTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    alignSelf: 'flex-end',
  },
  hostTime: {
    color: ParkColors.textMuted,
    alignSelf: 'flex-start',
  },
  quickReplyContainer: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: ParkColors.border,
  },
  quickChips: {
    flexDirection: 'row',
  },
  quickChip: {
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: ParkColors.border,
  },
  quickChipText: {
    color: ParkColors.secondary,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: 9999,
    paddingHorizontal: 16,
    color: ParkColors.text,
  },
  sendButton: {
    backgroundColor: ParkColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...ParkShadows.sm,
  },
});
