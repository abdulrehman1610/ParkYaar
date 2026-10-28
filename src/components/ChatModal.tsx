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

    // Simulated host reply after 1.5s
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
          style={styles.container}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.hostInfo}>
              <Image source={{ uri: hostPhoto }} style={styles.avatar} />
              <View>
                <View style={styles.nameRow}>
                  <Text style={styles.hostName}>{hostName}</Text>
                  <MaterialIcons name="verified" size={14} color={ParkColors.secondary} />
                </View>
                <Text style={styles.onlineStatus}>Online • Fast responder</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <MaterialIcons name="close" size={24} color={ParkColors.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Messages Scroll View */}
          <ScrollView style={styles.chatScroll} contentContainerStyle={styles.chatContent}>
            <View style={styles.encryptedBanner}>
              <MaterialIcons name="lock" size={12} color={ParkColors.textMuted} />
              <Text style={styles.encryptedText}>
                Encrypted in-app messaging • Host phone is masked
              </Text>
            </View>

            {messages.map((m) => (
              <View
                key={m.id}
                style={[
                  styles.messageBubble,
                  m.sender === 'user' ? styles.userBubble : styles.hostBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    m.sender === 'user' ? styles.userText : styles.hostText,
                  ]}
                >
                  {m.text}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
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
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickChips}>
              {quickReplies.map((qr, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.quickChip}
                  onPress={() => handleSend(qr)}
                >
                  <Text style={styles.quickChipText}>{qr}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Input Row */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Message host..."
              placeholderTextColor={ParkColors.textMuted}
              value={inputText}
              onChangeText={setInputText}
              onSubmitEditing={() => handleSend()}
            />
            <TouchableOpacity
              style={styles.sendButton}
              activeOpacity={0.8}
              onPress={() => handleSend()}
            >
              <MaterialIcons name="send" size={18} color="#FFFFFF" />
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
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: ParkRadii.sheet,
    borderTopRightRadius: ParkRadii.sheet,
    height: '75%',
    maxHeight: 600,
    ...ParkShadows.sheet,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: ParkColors.border,
  },
  hostInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ParkColors.surfaceHigh,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hostName: {
    fontSize: 15,
    fontWeight: '700',
    color: ParkColors.text,
  },
  onlineStatus: {
    fontSize: 11,
    color: ParkColors.success,
    fontWeight: '500',
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    gap: 12,
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
    fontSize: 10,
    color: ParkColors.textMuted,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
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
    fontSize: 14,
    lineHeight: 19,
  },
  userText: {
    color: '#FFFFFF',
  },
  hostText: {
    color: ParkColors.text,
  },
  messageTime: {
    fontSize: 10,
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
    paddingHorizontal: 16,
    gap: 8,
  },
  quickChip: {
    backgroundColor: ParkColors.surfaceLow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9999,
    borderWidth: 1,
    borderColor: ParkColors.border,
  },
  quickChipText: {
    fontSize: 12,
    color: ParkColors.secondary,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 16,
    paddingTop: 8,
    gap: 10,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: ParkColors.surfaceLow,
    borderRadius: 9999,
    paddingHorizontal: 16,
    fontSize: 14,
    color: ParkColors.text,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ParkColors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    ...ParkShadows.sm,
  },
});
