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

let taskTimer: NodeJS.Timeout | null = null;

const StartedTasksPage: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { currentPatientId, patients } = useSelector(
    (state: RootState) => state.patient
  );
  const dispatch = useDispatch();

  const [timeLeft, setTimeLeft] = useState(0);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [notes, setNotes] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTaskDescription, setSelectedTaskDescription] = useState('');

  const currentPatient = patients.find((p) => p.id === currentPatientId);

  useEffect(() => {
    if (
      currentPatient &&
      currentPatient.status !== 'Ferdig' &&
      currentPatient.tasks.length > 0
    ) {
      setCurrentTaskIndex(0);
    }
  }, [currentPatient]);

  useEffect(() => {
    if (
      currentPatient &&
      currentPatient.status !== 'Ferdig' &&
      currentTaskIndex < currentPatient.tasks.length
    ) {
      startTaskTimer(currentTaskIndex);
    }
    return () => clearTaskTimer();
  }, [currentPatient, currentTaskIndex]);

  useEffect(() => {
    if (
      timeLeft > 0 &&
      currentPatient &&
      currentPatient.status !== 'Ferdig'
    ) {
      taskTimer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(taskTimer);
    } else if (timeLeft === 0) {
      clearTaskTimer();
      if (
        currentPatient &&
        currentPatient.status !== 'Ferdig' &&
        currentTaskIndex < currentPatient.tasks.length
      ) {
        handleTaskCompletion();
      }
    }
  }, [timeLeft]);

  const clearTaskTimer = () => {
    if (taskTimer) {
      clearInterval(taskTimer);
      taskTimer = null;
    }
  };

  const startTaskTimer = (taskIndex: number) => {
    const taskDuration = currentPatient?.tasks[taskIndex]?.duration || 0;
    setTimeLeft(taskDuration * 60); // Convert minutes to seconds
  };

  const handleTaskCompletion = () => {
    if (currentPatient && currentTaskIndex < currentPatient.tasks.length) {
      dispatch(
        updateTaskStatus({
          patientId: currentPatient.id,
          taskId: currentPatient.tasks[currentTaskIndex].id,
          status: 'Påbegynt', // Set status to "Påbegynt" when starting
        })
      );

      if (currentTaskIndex < currentPatient.tasks.length - 1) {
        setCurrentTaskIndex((prevIndex) => prevIndex + 1);
        startTaskTimer(currentTaskIndex + 1); // Start timer for the next task
      } else {
        finishTasks();
      }
    }
  };

  const moveToNextPatient = () => {
    const currentIndex = patients.findIndex((p) => p.id === currentPatientId);

    if (currentIndex >= 0 && currentIndex < patients.length - 1) {
      const nextPatient = patients[currentIndex + 1];
      dispatch(setCurrentPatient(nextPatient.id));
    } else {
      dispatch(setCurrentPatient(''));
    }
  };

  const finishTasks = () => {
    if (currentPatient) {
      dispatch(updatePatientStatus({ id: currentPatient.id, status: 'Ferdig' }));
      moveToNextPatient();
      navigation.navigate('StartTaskPage');
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

  return (
    <View style={styles.container}>
      <Text style={styles.patientText}>Oppgaver for: {currentPatient.name}</Text>
      {currentPatient.tasks.map((task, index) => (
        <TouchableOpacity
          key={task.id}
          style={[
            styles.taskWrapper,
            index === currentTaskIndex ? styles.activeTask : {},
          ]}
          onPress={() => openTaskDescription(task.description)}
        >
          <Text style={styles.taskName}>{task.name}</Text>
          <Text style={styles.taskDuration}>{task.duration} min</Text>
          <Text style={styles.taskStatus}>Status: {task.status}</Text>
          {currentPatient.status !== 'Ferdig' && index === currentTaskIndex && (
            <Text style={styles.timerText}>
              Tid igjen: {Math.floor(timeLeft / 60)}:
              {timeLeft % 60 < 10 ? '0' : ''}
              {timeLeft % 60}
            </Text>
          )}
        </TouchableOpacity>
      ))}

      {/* Task Description Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
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
  taskWrapper: {
    padding: 15,
    backgroundColor: '#D8EFF4',
    borderRadius: 10,
    marginBottom: 10,
  },
  activeTask: {
    backgroundColor: '#A5DFD8',
  },
  taskName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  taskDuration: {
    fontSize: 14,
    color: '#666',
  },
  taskStatus: {
    fontSize: 14,
    color: '#333',
  },
  timerText: {
    fontSize: 16,
    color: '#FF5733',
    marginTop: 5,
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
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
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
