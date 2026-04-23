import React, {Activity, useState} from 'react';
import {StyleSheet, View, Text, Button, Modal, Pressable} from 'react-native';

/**
 * @param visible - Controls modal visibility
 * @param onClose - Callback to close the modal
 * @param activityGranted - Current state of physical activity permission
 * @param alarmGranted - Current state of alarm permission
 * @param onGrantActivity - Logic to trigger the activity permission request
 * @param onGrantAlarm - Logic to trigger the alarm settings redirect
 */
export const AndroidStepsModal = ({
  visible,
  onClose,
  activityGranted,
  alarmGranted,
  onGrantActivity,
  onGrantAlarm,
}: any) => {
  // Logic to determine if user can proceed to Step 2
  const step2Disabled = !activityGranted;
  const allDone = activityGranted && alarmGranted;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>System Setup</Text>
          <Text style={styles.subtitle}>
            Please complete these steps to enable background tracking.
          </Text>

          {/* --- STEP 1: ACTIVITY --- */}
          <View style={[styles.stepRow, activityGranted && styles.stepDone]}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Activity Tracking</Text>
              <Text style={styles.stepDesc}>
                Allows the app to detect physical steps.
              </Text>
              <View style={styles.btnAction}>
                <Pressable style={styles.button} onPress={onGrantActivity}>
                  <Text style={styles.buttonText}>Allow Access</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <Activity mode={alarmGranted ? 'hidden' : 'visible'}>
            <View style={[styles.stepRow]}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Alarms</Text>
                <Text style={styles.stepDesc}>
                  Necessary to sync data while the app is closed.
                </Text>
                <View style={styles.btnAction}>
                  <Pressable style={styles.button} onPress={onGrantAlarm}>
                    <Text style={styles.buttonText}>Open Settings</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </Activity>

          {/* --- FOOTER --- */}
          <View style={styles.footer}>
            <Pressable style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Continue</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F9F9F9',
  },
  stepDisabled: {
    opacity: 0.4,
  },
  stepDone: {
    backgroundColor: '#F9F9F9',
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#A0E984',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: 'white',
    fontWeight: 'bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  stepDesc: {
    fontSize: 13,
    color: '#444',
    marginVertical: 4,
  },
  btnAction: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: '#A0E984',
  },
  footer: {
    marginTop: 10,
    backgroundColor: '#A0E984',
  },
  closeBtn: {
    backgroundColor: '#000',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeBtnDisabled: {
    backgroundColor: '#A0E984',
    paddingVertical: 15,
    paddingHorizontal: '5%',
    alignItems: 'center',
    borderRadius: 10,
  },
  closeBtnText: {
    fontFamily: 'Poppins',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#A0E984',
    paddingVertical: 15,
    paddingHorizontal: '5%',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontFamily: 'Poppins',
    fontSize: 15,
  },
});
