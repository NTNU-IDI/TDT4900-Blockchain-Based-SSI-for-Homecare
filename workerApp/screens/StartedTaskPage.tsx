import {
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
    RootState,
    setCurrentPatient,
    updatePatientStatus,
    updateTaskStatus,
} from '../redux/store';
import { useDispatch, useSelector } from 'react-redux';

let visitTimer: NodeJS.Timeout | null = null;
  
  const StartedTasksPage: React.FC<{ navigation: any }> = ({ navigation }) => {
    const { currentPatientId, patients } = useSelector(
      (state: RootState) => state.patient
    );
    const dispatch = useDispatch();
  
    const [timeElapsed, setTimeElapsed] = useState(0); // Total time elapsed
    const [totalDuration, setTotalDuration] = useState(0); // Total visit duration
    const [notes, setNotes] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTaskDescription, setSelectedTaskDescription] = useState('');
  
    const currentPatient = patients.find((p) => p.id === currentPatientId);
  
    useEffect(() => {
      if (currentPatient && currentPatient.tasks.length > 0) {
        // Calculate the total visit duration
        const totalTime = currentPatient.tasks.reduce(
          (sum, task) => sum + task.duration,
          0
        );
        setTotalDuration(totalTime * 60); // Convert minutes to seconds
        startVisitTimer();
      }
  
      return () => clearVisitTimer(); // Cleanup on unmount
    }, [currentPatient]);
  
    const startVisitTimer = () => {
      visitTimer = setInterval(() => {
        setTimeElapsed((prev) => prev + 1);
      }, 1000);
    };
  
    const clearVisitTimer = () => {
      if (visitTimer) {
        clearInterval(visitTimer);
        visitTimer = null;
      }
    };
  
    const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const moveToNextPatient = () => {
        const currentIndex = patients.findIndex((p) => p.id === currentPatientId);
      
        if (currentIndex >= 0 && currentIndex < patients.length - 1) {
          const nextPatient = patients[currentIndex + 1];
          dispatch(setCurrentPatient(nextPatient.id));
        } else {
          // If no more patients, reset or handle completion
          console.log('Ferdig med alle besøk');
          dispatch(setCurrentPatient(''));
        }
      };
  
    const finishTasks = () => {
      if (currentPatient) {
        dispatch(updatePatientStatus({ id: currentPatient.id, status: 'Ferdig' }));
        moveToNextPatient();
      }
    };
  
    const openTaskDescription = (description: string) => {
      setSelectedTaskDescription(description);
      setModalVisible(true);
    };
  
    if (!currentPatient) {
      return (
        <View style={styles.container}>
          <Text style={styles.message}>Ingen pasient valgt.</Text>
        </View>
      );
    }
  
    const isOvertime = timeElapsed > totalDuration;
  
    return (
      <View style={styles.container}>
        <Text style={styles.patientText}>Oppgaver for: {currentPatient.name}</Text>
  
        {/* Display the timer */}
        <View style={styles.timerContainer}>
          <Text style={isOvertime ? styles.overtimeText : styles.timerText}>
            {isOvertime ? 'Overtid:' : 'Tid igjen:'} {formatTime(Math.abs(totalDuration - timeElapsed))}
          </Text>
        </View>
  
        {currentPatient.tasks.map((task) => (
          <View key={task.id} style={styles.taskContainer}>
            <TouchableOpacity
              style={styles.taskWrapper}
              onPress={() => openTaskDescription(task.description)}
            >
              <Text style={styles.taskName}>{task.name}</Text>
              <Text style={styles.taskStatus}>Beregnet tid: {task.duration} min</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.checkbox,
                task.status === 'Ferdig' && styles.checkboxCompleted,
              ]}
              onPress={() =>
                dispatch(
                  updateTaskStatus({
                    patientId: currentPatient.id,
                    taskId: task.id,
                    status: task.status === 'Ferdig' ? 'Ikke startet' : 'Ferdig',
                  })
                )
              }
            >
              <Text style={styles.checkboxText}>
                {task.status === 'Ferdig' ? '✓' : ''}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
  
        {/* Task Description Modal */}
<Modal
  visible={modalVisible}
  transparent={true}
  animationType="fade" // Use "fade" for smooth appearance
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalBackground}>
    <View style={styles.modalContainer}>
      <Text style={styles.modalText}>{selectedTaskDescription}</Text>
      <TouchableOpacity
        style={styles.modalCloseButton}
        onPress={() => setModalVisible(false)}
      >
        <Text style={styles.modalCloseButtonText}>Lukk</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>

  
        {/* General Notes */}
        <TextInput
          style={styles.notesInput}
          placeholder="Legg til notat her..."
          multiline
          value={notes}
          onChangeText={setNotes}
          editable={currentPatient.status !== 'Ferdig'}
        />
  
        <TouchableOpacity
          style={styles.doneButton}
          onPress={finishTasks}
          disabled={currentPatient.status === 'Ferdig'}
        >
          <Text style={styles.doneButtonText}>
            {currentPatient.status === 'Ferdig' ? 'All tasks done' : 'Ferdig'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  export default StartedTasksPage;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F9F9F9',
      padding: 20,
    },
    patientText: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333',
    },
    timerContainer: {
      marginBottom: 20,
      padding: 15,
      borderRadius: 10,
      backgroundColor: '#D8EFF4',
      alignItems: 'center',
    },
    timerText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    overtimeText: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#FF5733',
    },
    taskContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    taskWrapper: {
      flex: 1,
      padding: 15,
      backgroundColor: '#D8EFF4',
      borderRadius: 10,
      marginRight: 10,
    },
    taskName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    taskStatus: {
      fontSize: 14,
      color: '#666',
    },
    checkbox: {
      width: 30,
      height: 30,
      borderWidth: 2,
      borderColor: '#666',
      borderRadius: 5,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxCompleted: {
      backgroundColor: '#4CAF50',
      borderColor: '#4CAF50',
    },
    checkboxText: {
      fontSize: 16,
      color: '#FFF',
      fontWeight: 'bold',
    },
    notesInput: {
      height: 80,
      borderColor: '#CCC',
      borderWidth: 1,
      borderRadius: 10,
      padding: 10,
      marginTop: 20,
      backgroundColor: '#FFF',
    },
    doneButton: {
      backgroundColor: '#FF5733',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
      marginTop: 20,
    },
    doneButtonText: {
      color: '#FFF',
      fontSize: 16,
      fontWeight: 'bold',
    },
    modalBackground: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
      width: '80%',
      padding: 20,
      backgroundColor: '#FFF',
      borderRadius: 10,
      alignItems: 'center',
    },
    modalText: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
    },
    modalCloseButton: {
      backgroundColor: '#FF5733',
      padding: 10,
      borderRadius: 5,
    },
    modalCloseButtonText: {
      color: '#FFF',
      fontSize: 14,
    },
  });
  