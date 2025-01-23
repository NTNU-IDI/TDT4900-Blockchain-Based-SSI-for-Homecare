import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  setCurrentPatient,
  updatePatientStatus,
  updateTaskStatus
} from '../redux/patientSlicer';
import { useAppDispatch, useAppSelector } from '../redux/hooks';

import GreenButton from '../components/GreenButton';
import SharedStyles from '../styles/SharedStyles';

let visitTimer: NodeJS.Timeout | null = null;

const StartedTasksPage: React.FC = () => {
  const { currentPatientId, patients } = useAppSelector(
    (state) => state.patient
  );
  const dispatch = useAppDispatch();

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTaskDescription, setSelectedTaskDescription] = useState('');
  const [note, setNote] = useState('');

  const currentPatient = patients.find((p) => p.id === currentPatientId);
  const isOvertime = timeElapsed > totalDuration;

  useEffect(() => {
    if (currentPatient && currentPatient.tasks.length > 0) {
      const totalVisitTime = currentPatient.tasks.reduce(
        (sum, task) => sum + task.duration,
        0
      );
      setTotalDuration(totalVisitTime * 60);
      startVisitTimer();
    }

    return () => clearVisitTimer();
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
    if (currentIndex < patients.length - 1) {
      const nextPatient = patients[currentIndex + 1];
      dispatch(setCurrentPatient(nextPatient.id));
    } else {
      dispatch(setCurrentPatient(''));
    }
  };

  const finishTasks = () => {
    if (currentPatient) {
      dispatch(updatePatientStatus({ status: 'Ferdig' }));
      moveToNextPatient();
    }
  };

  const openTaskDescription = (description: string) => {
    setSelectedTaskDescription(description);
    setModalVisible(true);
  };

  if (!currentPatient) {
    return (
      <View style={SharedStyles.container}>
        <Text style={SharedStyles.message}>Ingen pasient valgt.</Text>
      </View>
    );
  }

  return (
    <View style={SharedStyles.container}>
      <Text style={SharedStyles.title}>
        Oppgaver for: {currentPatient.name}
      </Text>
      <View style={styles.timerContainer}>
        <Text style={isOvertime ? styles.overtimeText : styles.timerText}>
          {isOvertime ? 'Overtid:' : 'Tid igjen:'}{' '}
          {formatTime(Math.abs(totalDuration - timeElapsed))}
        </Text>
      </View>
      {currentPatient.tasks.map((task) => (
        <View key={task.id} style={styles.taskContainer}>
          <TouchableOpacity
            style={styles.taskWrapper}
            onPress={() => openTaskDescription(task.description)}
          >
            <Text style={styles.taskName}>{task.name}</Text>
            <Text style={styles.taskStatus}>
              Beregnet tid: {task.duration} min
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.checkbox,
              task.status === 'Ferdig' && styles.checkboxCompleted
            ]}
            onPress={() =>
              dispatch(
                updateTaskStatus({
                  taskId: task.id,
                  status: task.status === 'Ferdig' ? 'Ikke startet' : 'Ferdig'
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
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
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
      <TextInput
        style={SharedStyles.noteInput}
        placeholder="Legg til notat her..."
        multiline
        value={note}
        onChangeText={setNote}
      />
      <GreenButton onPress={finishTasks} title="Ferdig" />
    </View>
  );
};

export default StartedTasksPage;

const styles = StyleSheet.create({
  patientText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center'
  },
  timerContainer: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#BBE2EC',
    alignItems: 'center'
  },
  timerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333'
  },
  overtimeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF5733'
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10
  },
  taskWrapper: {
    flex: 1,
    padding: 15,
    backgroundColor: '#BBE2EC',
    borderRadius: 10,
    marginRight: 10
  },
  taskName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  taskStatus: {
    fontSize: 14,
    color: '#555'
  },
  checkbox: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: '#666',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center'
  },
  checkboxCompleted: {
    backgroundColor: '#0D9276',
    borderColor: '#0D9276'
  },
  checkboxText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold'
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    alignItems: 'center'
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
  modalCloseButton: {
    backgroundColor: '#0D9276',
    padding: 10,
    borderRadius: 5
  },
  modalCloseButtonText: {
    color: '#FFF',
    fontSize: 14
  }
});
