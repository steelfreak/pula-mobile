import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container } from '../components/Container';

export default function HomeScreen() {
  return (
    <Container>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to AGPB</Text>
        <Text style={styles.subtitle}>Your personal assistant</Text>
        <View style={styles.separator} />
        <Text style={styles.description}>
          This is your home screen. Start building your amazing app here!
        </Text>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
  },
  separator: {
    height: 1,
    width: '80%',
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});
