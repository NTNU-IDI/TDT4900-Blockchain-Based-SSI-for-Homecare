import { StyleSheet } from 'react-native';
const HomeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  patientCard: {
    backgroundColor: '#D8EFF4',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  currentPatientCard: {
    backgroundColor: '#006A70',
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  patientInfo: {
    fontSize: 14,
    color: '#666',
  },
  patientKey: {
    fontSize: 14,
    color: '#999',
  },
  patientStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
})

export default HomeStyles;