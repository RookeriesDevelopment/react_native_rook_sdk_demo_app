import {
  createAsyncStorage,
  type AsyncStorage,
} from '@react-native-async-storage/async-storage';

const USER_PREFERENCES = 'user_preferences';

type UserPreferences = {
  instance: AsyncStorage | null;
  createInstance: () => void;
  savePreference: (key: string, value: string) => Promise<boolean>;
  getPreference: (key: string) => Promise<string>;
};

export const userPreferences: UserPreferences = {
  instance: null,
  createInstance: function () {
    if (this.instance !== null) return;

    this.instance = createAsyncStorage(USER_PREFERENCES);
  },
  savePreference: async function (key: string, value: string) {
    if (this.instance === null) this.createInstance();

    try {
      await this.instance?.setItem(key, value);
      return true;
    } catch (error) {
      return false;
    }
  },
  getPreference: async function (key: string) {
    if (this.instance === null) this.createInstance();

    const result = await this.instance?.getItem(key);
    return result || '';
  },
};
