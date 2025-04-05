import { useState } from 'react';
import axios from 'axios';
import { compareVersions } from '@/constants/utils';
import pkg from '../../package.json';

export function useUpdateChecker() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdateChecked, setIsUpdateChecked] = useState(false);
  const [updateInfo, setUpdateInfo] = useState({
    currentVersion: pkg.version,
    newVersion: '',
    updateType: '',
    createdAt: '',
    isNewVersionPreRelease: false,
  });

  const checkForUpdates = async (url: string) => {
    try {
      const { data } = await axios.get(url);
      const localVersion = pkg.version;
      const remoteVersion = Array.isArray(data) ? data[0].tag_name.replace('v', '') : data.tag_name.replace('v', '');

      // Get update type
      const updateType = compareVersions(localVersion, remoteVersion);

      // Set update available if it's not "No update available"
      const hasUpdate = !updateType.includes('No update');

      setUpdateInfo({
        currentVersion: localVersion,
        newVersion: remoteVersion,
        updateType,
        createdAt: Array.isArray(data) ? data[0].created_at : data.created_at,
        isNewVersionPreRelease: Array.isArray(data) ? data[0].prerelease : data.prerelease,
      });

      setIsUpdateAvailable(hasUpdate);
      setIsUpdateChecked(true);
      return data; //returning data for further use if needed
    } catch (error) {
      console.log(error);
      setIsUpdateChecked(true); // Still mark as checked even on error
    }
  };

  return { isUpdateAvailable, isUpdateChecked, updateInfo, checkForUpdates, setIsUpdateAvailable };
}
