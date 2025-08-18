import { SafeAreaView, StatusBar, View } from 'react-native';
import { colors } from 'lib/theme';

export const Container = ({ children, header }: { children: React.ReactNode, header: React.ReactNode }) => {
  return (
    <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.darkGray} />
      <View style={styles.statusBar}>
      </View>
      {header}
      <View style={styles.content}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    // marginTop: 45,
    flex: 1,
    backgroundColor: colors.lightGray,
  },
  content: {
    margin: 16,
    flex: 1,
  },
  statusBar: {
    height: 45,
    backgroundColor: colors.darkGray,
  },
};
