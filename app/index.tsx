import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { useFonts } from 'expo-font';
import Ionicons from '@expo/vector-icons/Ionicons';
import SettingsScreen from './SettingsScreen';
import { storage } from './db/db';
import fetchTrainData from '@/scripts/fetchTrain';

const ScreenWidth = Dimensions.get('window').width;
const ScreenHeight = Dimensions.get('window').height;

interface Xmlns {
  Count: number;
}

interface Location {
  crs: string;
  locationName: string;
}

interface Service {
  destination: Location[];
  detachFront: boolean;
  etd: string;
  filterLocationCancelled: boolean;
  futureCancellation: boolean;
  futureDelay: boolean;
  isCancelled: boolean;
  isCircularRoute: boolean;
  isReverseFormation: boolean;
  length: number;
  operator: string;
  operatorCode: string;
  origin: Location[];
  platform: string;
  rsid: string;
  serviceID: string;
  serviceType: string;
  std: string;
  subsequentCallingPoints: Location[];
}

interface ApiResponse {
  xmlns: Xmlns;
  areServicesAvailable: boolean;
  crs: string;
  filterLocationName: string;
  filterType: string;
  filtercrs: string;
  generatedAt: string;
  locationName: string;
  platformAvailable: boolean;
  trainServices: Service[];
}

interface Data {
  response: ApiResponse[];
}

export default function HomeScreen() {
  const [trainData, setTrainData] = useState<Data | null>(null);
  const [update, setUpdate] = useState<boolean>(false);
  const [settings, setSettings] = useState<string>('false');

  useEffect(() => {
    const fetchData = async () => {
      try {
        let origin = storage.getString('origin') ?? 'HFN';
        let destination = storage.getString('destination') ?? 'OLD';
        const result = await fetchTrainData(origin, destination);
        setTrainData(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let origin = storage.getString('origin') ?? 'HFN';
        let destination = storage.getString('destination') ?? 'OLD';
        const result = await fetchTrainData(origin, destination);
        setTrainData(result);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    setUpdate(false);
  }, [update]);

  const [fontsLoaded, fontError] = useFonts({
    'DotGothic16-Regular': require('../assets/fonts/DotGothic16-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return settings === 'true' ? (
    <SettingsScreen setSettings={setSettings} setUpdate={setUpdate} />
  ) : (
    <View style={styles.main}>
      <Text style={[styles.title, { fontFamily: 'DotGothic16-Regular' }]}>
        RAILTRACKER
      </Text>
      <Ionicons
        name='settings'
        size={32}
        color='yellow'
        onPress={() => setSettings('true')}
        style={{ position: 'absolute', top: 12, right: 24 }}
      />
      <View style={styles.section}>
        <View style={styles.titleContainer} id='isnt-centered'>
          <Text style={[styles.text, { fontFamily: 'DotGothic16-Regular' }]}>
            {trainData?.response[0].locationName} to{' '}
            {trainData?.response[0].filterLocationName}
          </Text>
        </View>
        <View style={styles.textContainer}>
          {trainData?.response[0].trainServices.map((service) => (
            <View key={service.serviceID} style={styles.serviceContainer}>
              <Text
                style={[styles.text, { fontFamily: 'DotGothic16-Regular' }]}
              >
                {service.std} {service.etd}
              </Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.section}>
        <View style={styles.titleContainer}>
          <Text style={[styles.text, { fontFamily: 'DotGothic16-Regular' }]}>
            {trainData?.response[1].locationName} to{' '}
            {trainData?.response[1].filterLocationName}
          </Text>
        </View>
        <View style={styles.textContainer}>
          {trainData?.response[1].trainServices.map((service) => (
            <View key={service.serviceID} style={styles.serviceContainer}>
              <Text
                style={[styles.text, { fontFamily: 'DotGothic16-Regular' }]}
              >
                {service.std} {service.etd}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: 'black',
    alignItems: 'center',
    marginTop: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'yellow',
    marginTop: 8,
  },
  section: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 16,
    backgroundColor: 'black',
    width: '100%', // Ensure the container takes the full width
  },
  textContainer: {
    margin: 16,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'yellow',
    textAlign: 'center', // Center text inside its container
  },
  serviceContainer: {
    marginBottom: 8,
    alignItems: 'center',
  },
});
