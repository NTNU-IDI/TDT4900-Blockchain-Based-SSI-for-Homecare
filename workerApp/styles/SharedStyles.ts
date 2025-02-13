import { StyleSheet } from 'react-native';

export const SharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 20
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center'
  },
  card: {
    backgroundColor: '#BBE2EC',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5
  },
  cardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  noteInput: {
    height: 100,
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#FFF'
  },
  patientCard: {
    backgroundColor: '#BBE2EC',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3, // For Android
    shadowColor: '#000', // For iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  message: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center'
  }
});

export default SharedStyles;
