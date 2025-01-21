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
    backgroundColor: '#004D4F', // Darker teal color for better contrast
    borderWidth: 2,
    borderColor: '#00B3B3', // Highlight border
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Shadow for Android
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  currentPatientName: {
    color: '#FFFFFF', // White text for selected patient
  },
  patientInfo: {
    fontSize: 14,
    color: '#666',
  },
  currentPatientInfo: {
    color: '#E0FFFF', // Light text for better contrast
  },
  patientKey: {
    fontSize: 14,
    color: '#999',
  },
  currentPatientKey: {
    color: '#E0FFFF',
  },
  patientStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  currentPatientStatus: {
    color: '#FFFFFF',
  },
});


export default HomeStyles;