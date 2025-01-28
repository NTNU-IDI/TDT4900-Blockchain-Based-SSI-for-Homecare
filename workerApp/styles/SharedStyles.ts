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
  button: {
    backgroundColor: '#0D9276',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold'
  },
  card: {
    backgroundColor: '#BBE2EC',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 5, // For Android shadows
    shadowColor: '#000', // For iOS shadows
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
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
    shadowRadius: 5,
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
