import React from 'react';
import { StatusBar } from 'react-native';
import { SearchProvider } from './src/context/SearchContext';
import SearchScreen from './src/screens/SearchScreen';

export default function App() {
  return (
    <SearchProvider>
      <StatusBar barStyle="dark-content" />
      <SearchScreen />
    </SearchProvider>
  );
}
