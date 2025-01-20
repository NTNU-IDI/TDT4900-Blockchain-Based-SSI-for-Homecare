import { StyleSheet } from 'react-native';

const HomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  header: {
    backgroundColor: '#D8EFF4',
    padding: 20,
    paddingTop: 50, // Add padding for better spacing on mobile devices
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  list: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  date: {
    fontSize: 16,
    color: '#006A70',
    fontWeight: '500',
    marginBottom: 5,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2, // For Android shadow
  },
  currentPatient: {
    borderLeftWidth: 4,
    borderLeftColor: '#006A70',
    backgroundColor: '#E9F7F8',
  },
  timeContainer: {
    marginRight: 15,
  },
  time: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#006A70',
  },
  details: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  address: {
    fontSize: 14,
    color: '#777',
    marginTop: 2,
  },
  keyNumber: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  status: {
    fontSize: 14,
    fontWeight: '500',
    color: '#999',
  },
  activeStatus: {
    color: '#006A70',
  },
});

export default HomeStyles;
