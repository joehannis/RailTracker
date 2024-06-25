import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { storage } from './db/db';

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

interface Settings {
  origin: string;
  destination: string;
}

interface Props {
  setSettings: React.Dispatch<React.SetStateAction<string>>;
  setUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

const SettingsScreen: React.FC<Props> = ({ setSettings, setUpdate }) => {
  const navigation = useNavigation();

  const { control, handleSubmit } = useForm({
    defaultValues: {
      origin: '',
      destination: '',
    },
  });

  const onSubmit = (data: Settings) => {
    storage.set('origin', data.origin.toUpperCase());
    storage.set('destination', data.destination.toUpperCase());
    setUpdate(true);
    setSettings('false');
  };

  return (
    <View style={styles.main}>
      <Text style={[styles.title, { fontFamily: 'DotGothic16-Regular' }]}>
        RAILTRACKER
      </Text>
      <Text style={[styles.page, { fontFamily: 'DotGothic16-Regular' }]}>
        Settings
      </Text>
      <View style={styles.container}>
        <Text style={[styles.heading, { fontFamily: 'DotGothic16-Regular' }]}>
          Journey Details
        </Text>
        <Controller
          control={control}
          name={'origin'}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              placeholder='Origin CRS Code'
              style={[styles.input, { fontFamily: 'DotGothic16-Regular' }]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />
        <Controller
          control={control}
          name={'destination'}
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              placeholder='Destination CRS Code'
              style={[
                styles.input,
                { fontFamily: 'DotGothic</View>16-Regular' },
              ]}
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
            />
          )}
        />

        <Button title='Submit' onPress={handleSubmit(onSubmit)} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flex: 1,
    backgroundColor: 'black',
    color: 'yellow',
    width: ScreenWidth,
    height: ScreenHeight,
    marginTop: 24,
  },

  title: {
    display: 'flex',
    fontSize: 28,
    fontWeight: 'bold',
    color: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    textAlign: 'center',
  },

  page: {
    display: 'flex',
    fontSize: 24,
    fontWeight: 'bold',
    color: 'yellow',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    textAlign: 'center',
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 16,
    backgroundColor: 'black',
    color: 'yellow',
    textAlign: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'yellow',
    margin: 8,
    textAlign: 'center',
  },
  input: {
    margin: 8,
    padding: 8,
    backgroundColor: 'black',
    color: 'yellow',
    borderColor: 'yellow',
    borderWidth: 1,
    textAlign: 'center',
  },
});

export default SettingsScreen;
