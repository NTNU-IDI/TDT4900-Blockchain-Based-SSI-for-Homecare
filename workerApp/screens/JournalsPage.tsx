import React, { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

import { Client } from '../types/client';
import ClientJournal from './ClientJournal';
import JournalRequest from './JournalRequest';
import SharedStyles from '../styles/SharedStyles';
import { fetchAccessStatus } from '../redux/clientSlicer';
import { useFocusEffect } from '@react-navigation/native';

const JournalsPage: React.FC = () => {
  const { clients: clients } = useAppSelector((state) => state.client);
  const [selectedJournalClient, setSelectedJournalClient] = useState<Client>();
  const [viewType, setViewType] = useState<'journal' | 'request' | null>(null);
  const dispatch = useAppDispatch();

  useFocusEffect(
    useCallback(() => {
      clients.forEach((client) =>
        dispatch(
          fetchAccessStatus({
            clientId: client.id,
            currentAccessStatus: client.access
          })
        )
      );
    }, [dispatch, clients])
  );

  const handleClientPress = (client: Client) => {
    dispatch(
      fetchAccessStatus({
        clientId: client.id,
        currentAccessStatus: client.access
      })
    );
    if (client.accessRequest) {
      return console.log('Access already requested for', client.name);
    }
    setSelectedJournalClient(client);
    setViewType(client.access ? 'journal' : 'request');
  };

  const onBack = () => {
    setSelectedJournalClient(undefined);
    setViewType(null);
  };

  if (viewType === 'journal' && selectedJournalClient) {
    return <ClientJournal client={selectedJournalClient} onBack={onBack} />;
  }

  if (viewType === 'request' && selectedJournalClient) {
    return <JournalRequest client={selectedJournalClient} onBack={onBack} />;
  }

  const ACCESS_COLORS = {
    granted: '#0D9276',
    denied: '#D44F3A',
    requested: '#D98A00'
  };

  const getAccessText = (client: Client) => {
    if (client.access) return 'Tilgang';
    if (client.accessRequest) return 'Bedt om tilgang';
    return 'Ikke tilgang';
  };

  const getAccessStyle = (client: Client) => ({
    ...SharedStyles.boldCardTitle,
    color: client.access
      ? ACCESS_COLORS.granted
      : client.accessRequest
        ? ACCESS_COLORS.requested
        : ACCESS_COLORS.denied
  });

  return (
    <View style={SharedStyles.container}>
      <Text style={SharedStyles.title}>Pasientjournaler</Text>
      {clients.map((client) => (
        <TouchableOpacity
          key={client.id}
          style={SharedStyles.clientCard}
          onPress={() => handleClientPress(client)}
        >
          <View>
            <Text style={SharedStyles.boldCardTitle}>{client.name}</Text>
          </View>
          <Text style={getAccessStyle(client)}>{getAccessText(client)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};
export default JournalsPage;
