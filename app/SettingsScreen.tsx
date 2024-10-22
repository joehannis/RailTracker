import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
} from 'react-native';
import { useState, useRef, useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import { storage } from './db/db';
import { AutocompleteDropdown } from 'react-native-autocomplete-dropdown';

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

  const [loading, setLoading] = useState<boolean>(false);
  const [suggestionsList, setSuggestionsList] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const dropdownController = useRef(null);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      origin: '',
      destination: '',
    },
  });

  const searchRef = useRef(null);

  const getSuggestions = useCallback(async (q) => {
    const filterToken = q.toLowerCase();
    console.log('getSuggestions', q);
    if (typeof q !== 'string' || q.length < 3) {
      setSuggestionsList(null);
      return;
    }
    setLoading(true);
    const headers = new Headers();
    headers.set('x-apikey', process.env.EXPO_STATION_APIKEY);

    const response = await fetch(
      `https://api1.raildata.org.uk/1010-knowlegebase-stations-xml-feed1_1/4.0/stations-LE.xml`,
      {
        headers: headers,
      }
    );
    const items = await response.json();
    console.log(items);
    const suggestions = items
      .filter((item) => item.title.toLowerCase().includes(filterToken))
      .map((item) => ({
        id: item.id,
        title: item.title,
      }));
    setSuggestionsList(suggestions);
    setLoading(false);
  }, []);

  const onClearPress = useCallback(() => {
    setSuggestionsList(null);
  }, []);

  const onOpenSuggestionsList = useCallback((isOpened) => {}, []);

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

        <AutocompleteDropdown
          ref={searchRef}
          controller={(controller) => {
            dropdownController.current = controller;
          }}
          // initialValue={'1'}
          direction={'down'}
          dataSet={suggestionsList}
          onChangeText={getSuggestions}
          onSelectItem={(item) => {
            item && setSelectedItem(item.id);
          }}
          debounce={600}
          suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
          onClear={onClearPress}
          //  onSubmit={(e) => onSubmitSearch(e.nativeEvent.text)}
          onOpenSuggestionsList={onOpenSuggestionsList}
          loading={loading}
          useFilter={false} // set false to prevent rerender twice
          textInputProps={{
            placeholder: 'Type 3+ letters (dolo...)',
            autoCorrect: false,
            autoCapitalize: 'none',
            style: {
              borderRadius: 25,
              backgroundColor: '#383b42',
              color: '#fff',
              paddingLeft: 18,
            },
          }}
          rightButtonsContainerStyle={{
            right: 8,
            height: 30,

            alignSelf: 'center',
          }}
          inputContainerStyle={{
            backgroundColor: '#383b42',
            borderRadius: 25,
          }}
          suggestionsListContainerStyle={{
            backgroundColor: '#383b42',
          }}
          containerStyle={{ flexGrow: 1, flexShrink: 1 }}
          renderItem={(item, text) => (
            <Text style={{ color: '#fff', padding: 15 }}>{item.title}</Text>
          )}
          //   ChevronIconComponent={<Feather name="chevron-down" size={20} color="#fff" />}
          //   ClearIconComponent={<Feather name="x-circle" size={18} color="#fff" />}
          inputHeight={50}
          showChevron={false}
          closeOnBlur={false}
          //  showClear={false}
        />

        <AutocompleteDropdown
          ref={searchRef}
          controller={(controller) => {
            dropdownController.current = controller;
          }}
          // initialValue={'1'}
          direction={'down'}
          dataSet={suggestionsList}
          onChangeText={getSuggestions}
          onSelectItem={(item) => {
            item && setSelectedItem(item.id);
          }}
          debounce={600}
          suggestionsListMaxHeight={Dimensions.get('window').height * 0.4}
          onClear={onClearPress}
          //  onSubmit={(e) => onSubmitSearch(e.nativeEvent.text)}
          onOpenSuggestionsList={onOpenSuggestionsList}
          loading={loading}
          useFilter={false} // set false to prevent rerender twice
          textInputProps={{
            placeholder: 'Type 3+ letters (dolo...)',
            autoCorrect: false,
            autoCapitalize: 'none',
            style: {
              borderRadius: 25,
              backgroundColor: '#383b42',
              color: '#fff',
              paddingLeft: 18,
            },
          }}
          rightButtonsContainerStyle={{
            right: 8,
            height: 30,

            alignSelf: 'center',
          }}
          inputContainerStyle={{
            backgroundColor: '#383b42',
            borderRadius: 25,
          }}
          suggestionsListContainerStyle={{
            backgroundColor: '#383b42',
          }}
          containerStyle={{ flexGrow: 1, flexShrink: 1 }}
          renderItem={(item, text) => (
            <Text style={{ color: '#fff', padding: 15 }}>{item.title}</Text>
          )}
          //   ChevronIconComponent={<Feather name="chevron-down" size={20} color="#fff" />}
          //   ClearIconComponent={<Feather name="x-circle" size={18} color="#fff" />}
          inputHeight={50}
          showChevron={false}
          closeOnBlur={false}
          //  showClear={false}
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
