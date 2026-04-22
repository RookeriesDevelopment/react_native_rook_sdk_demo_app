import {useState, useEffect, useRef} from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {useRookPermissions} from 'react-native-rook-sdk';

export const useOptimizations = () => {
  const {ready, isBatteryOptimizationDisabled, isAutoStartSettingRequired} =
    useRookPermissions();

  const [showBatteryButton, setShowBatteryButton] = useState(true);
  const [showAutoStartAlert, setShowAutoStartAlert] = useState(true);

  const appState = useRef(AppState.currentState);

  const refreshStatuses = async () => {
    if (!ready) return;

    try {
      // 1. Check if the user has already disabled optimizations
      const batteryDisabled = await isBatteryOptimizationDisabled();

      // 2. Check if this device brand (Xiaomi, etc.) needs auto-start
      const autoStartRequired = await isAutoStartSettingRequired();

      // Update state: Show button only if battery optimization is still ENABLED
      setShowBatteryButton(!batteryDisabled);

      // Update state: Show alert if the device brand is supported/required
      setShowAutoStartAlert(autoStartRequired);
    } catch (e) {
      console.warn('Failed to check settings status:', e);
    }
  };

  useEffect(() => {
    // Perform initial check on mount
    refreshStatuses();

    // --- ON_RESUME Implementation ---
    const subscription = AppState.addEventListener(
      'change',
      (nextAppState: AppStateStatus) => {
        // Check if app is returning from background to foreground
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          // Equivalent to Lifecycle.Event.ON_RESUME
          refreshStatuses();
        }
        appState.current = nextAppState;
      },
    );

    return () => {
      subscription.remove();
    };
  }, [ready]); // Re-run if the SDK ready state changes
  return {
    showBatteryButton,
    showAutoStartAlert,
    refreshStatuses, // Can be called manually if needed
  };
};
