import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/types';
import { theme } from '../theme/theme';

type NavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>EVOLVA</Text>
          <Text style={styles.subtitle}>Personal Growth Operating System</Text>
        </View>

        <View style={styles.grid}>
          <TouchableOpacity 
            style={styles.primaryCard}
            onPress={() => navigation.navigate('Chat')}
          >
            <View style={styles.cardHeaderInline}>
              <Text style={styles.cardIcon}>💬</Text>
              <Text style={styles.primaryCardTitle}>Open Front Door</Text>
            </View>
            <Text style={styles.primaryCardDesc}>
              The entry point. Conversation feeds the pipeline.
            </Text>
            <View style={styles.flowBadge}>
              <Text style={styles.flowBadgeText}>INPUT LAYER → ACTIVE</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>System Modules</Text>
          </View>

          <View style={[styles.moduleCard, styles.disabledCard]}>
            <View style={styles.moduleHeader}>
              <Text style={styles.moduleIcon}>🧠</Text>
              <View style={styles.moduleTitleContainer}>
                <Text style={styles.moduleTitle}>Memory Engine</Text>
                <Text style={styles.moduleStatus}>Offline - Target Block 4</Text>
              </View>
            </View>
            <Text style={styles.moduleDesc}>
              Extracts, scores, and links conversational data into permanent graph storage.
            </Text>
          </View>

          <View style={[styles.moduleCard, styles.disabledCard]}>
            <View style={styles.moduleHeader}>
              <Text style={styles.moduleIcon}>👤</Text>
              <View style={styles.moduleTitleContainer}>
                <Text style={styles.moduleTitle}>Identity Profile</Text>
                <Text style={styles.moduleStatus}>Offline - Target Block 5</Text>
              </View>
            </View>
            <Text style={styles.moduleDesc}>
              Maps core traits, psychological values, motivations, and evolving self-schema.
            </Text>
          </View>

          <View style={[styles.moduleCard, styles.disabledCard]}>
            <View style={styles.moduleHeader}>
              <Text style={styles.moduleIcon}>📊</Text>
              <View style={styles.moduleTitleContainer}>
                <Text style={styles.moduleTitle}>Insight System</Text>
                <Text style={styles.moduleStatus}>Offline - Target Block 6</Text>
              </View>
            </View>
            <Text style={styles.moduleDesc}>
              Analyzes multi-turn long-term continuity to isolate behavior trends and growth anomalies.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  scrollContainer: { padding: theme.spacing.md },
  header: { marginTop: theme.spacing.xl, marginBottom: theme.spacing.xl, borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingBottom: theme.spacing.md },
  title: { fontSize: 38, fontWeight: '900', color: theme.colors.text, letterSpacing: 2 },
  subtitle: { fontSize: 14, color: theme.colors.textMuted, marginTop: theme.spacing.xs, textTransform: 'uppercase', letterSpacing: 1 },
  grid: { gap: theme.spacing.md },
  primaryCard: { backgroundColor: '#1A1B2F', padding: theme.spacing.lg, borderRadius: theme.borderRadius.lg, borderWidth: 1, borderColor: theme.colors.primary },
  cardHeaderInline: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm, marginBottom: theme.spacing.sm },
  primaryCardTitle: { fontSize: 22, fontWeight: '700', color: theme.colors.text },
  primaryCardDesc: { fontSize: 14, color: '#A5A6F6', lineHeight: 20 },
  flowBadge: { alignSelf: 'flex-start', backgroundColor: 'rgba(99, 102, 241, 0.2)', paddingHorizontal: theme.spacing.sm, paddingVertical: theme.spacing.xs, borderRadius: theme.borderRadius.sm, marginTop: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.primary },
  flowBadgeText: { color: '#C7C8FF', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  sectionHeader: { marginTop: theme.spacing.md, marginBottom: theme.spacing.xs },
  sectionTitle: { fontSize: 13, fontWeight: '700', color: theme.colors.textMuted, textTransform: 'uppercase', letterSpacing: 1.5 },
  moduleCard: { backgroundColor: theme.colors.surface, padding: theme.spacing.md, borderRadius: theme.borderRadius.lg, borderWidth: 1, borderColor: theme.colors.border },
  disabledCard: { opacity: 0.5 },
  moduleHeader: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md, marginBottom: theme.spacing.sm },
  moduleIcon: { fontSize: 24, color: theme.colors.textMuted },
  moduleTitleContainer: { flex: 1 },
  moduleTitle: { fontSize: 16, fontWeight: '600', color: theme.colors.text },
  moduleStatus: { fontSize: 11, color: theme.colors.textMuted, fontFamily: 'monospace', marginTop: 2 },
  moduleDesc: { fontSize: 13, color: theme.colors.textMuted, lineHeight: 18 }
});
