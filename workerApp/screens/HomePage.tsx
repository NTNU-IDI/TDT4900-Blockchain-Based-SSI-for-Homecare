import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

import React from 'react';
import SharedStyles from '../styles/SharedStyles';
import { setCurrentClient } from '../redux/clientSlicer';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentClientId, clients } = useAppSelector((state) => state.client);

  const currentDate = new Date().toLocaleDateString('no-NO', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const currentDateFormatted =
    currentDate.charAt(0).toUpperCase() + currentDate.slice(1);

  return (
    <View style={SharedStyles.container}>
      <Text style={SharedStyles.title}>{currentDateFormatted}</Text>
      {clients.map((client) => {
        const isCurrentClient = currentClientId === client.id;

        return (
          <TouchableOpacity
            key={client.id}
            style={[
              SharedStyles.clientCard,
              isCurrentClient && styles.currentclientCard
            ]}
            onPress={() => dispatch(setCurrentClient(client.id))}
          >
            <View>
              <Text
                style={[
                  SharedStyles.boldCardTitle,
                  isCurrentClient && styles.currentClientName
                ]}
              >
                {client.name}
              </Text>
              {!client.access && (
                <>
                  <Text style={styles.noAccessMessage}>
                    Ikke tilgang. Be om tilgang på journalsiden.
                  </Text>
                </>
              )}

              {client.access && (
                <>
                  <Text
                    style={[
                      styles.clientInfo,
                      isCurrentClient && styles.currentClientInfo
                    ]}
                  >
                    {client.time} - {client.address}
                  </Text>
                  {client.nøkkelnummer?.trim() && (
                    <Text
                      style={[
                        SharedStyles.greyCardText,
                        isCurrentClient && styles.currentClientKey
                      ]}
                    >
                      Nøkkelnummer: {client.nøkkelnummer}
                    </Text>
                  )}
                </>
              )}
            </View>

            <Text
              style={[
                styles.clientStatus,
                isCurrentClient && styles.currentClientStatus
              ]}
            >
              {client.status}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  currentClientCard: {
    backgroundColor: '#0D9276',
    borderWidth: 2,
    borderColor: '#00B3B3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  currentClientName: {
    color: '#FFFFFF'
  },
  clientInfo: {
    fontSize: 14,
    color: '#444'
  },
  currentClientInfo: {
    color: '#E0FFFF'
  },
  currentClientKey: {
    color: '#E0FFFF'
  },
  clientStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333'
  },
  currentClientStatus: {
    color: '#FFFFFF'
  },
  noAccessMessage: {
    fontSize: 14,
    color: '#D44F3A',
    marginTop: 5
  }
});
