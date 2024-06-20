import { Image, StyleSheet, Text, View, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import fetchTrain from '@/scripts/fetchTrain';
import { useFonts } from 'expo-font';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTrain();
        setTrainData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 60000);

    return () => clearInterval(interval);
  }, []);

  const [fontsLoaded, fontError] = useFonts({
    'DotGothic16-Regular': require('../../assets/fonts/DotGothic16-Regular.ttf'),
  });

  // const onLayoutRootView = useCallback(async () => {
  //   if (fontsLoaded || fontError) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded, fontError]);

  // if (!fontsLoaded && !fontError) {
  //   return null;
  // }

  return (
    <View style={styles.main}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#000000', dark: '#000000' }}
        headerTitle='RailTracker'
      >
        <View style={styles.body}>
          <View style={styles.section}>
            <View style={styles.titleContainer}>
              <Text
                style={[styles.text, { fontFamily: 'DotGothic16-Regular' }]}
              >
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
              <Text
                style={[styles.text, { fontFamily: 'DotGothic16-Regular' }]}
              >
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
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    display: 'flex',
    flexGrow: 1,
    flex: 1,
    backgroundColor: 'black',
    color: 'yellow',
    width: '100%',
    height: 'max-content',
  },
  body: {
    backgroundColor: 'black',
    color: 'yellow',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexGrow: 1,
    flex: 1,
    width: '100%',
    height: '100%',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flexGrow: 1,
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    margin: 16,
    backgroundColor: 'black',
    color: 'yellow',
  },
  textContainer: {
    margin: 16,
    color: 'yellow',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'yellow',
  },
  serviceContainer: {
    marginBottom: 8,
    backgroundColor: 'black',
    color: 'yellow',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
