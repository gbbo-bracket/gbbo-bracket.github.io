/**
 * Profile preference (which participant is "you").
 *
 * A full login is overkill for a friendly bracket site, so instead each visitor
 * can pick which participant they are from the list in Airtable. The choice is
 * remembered in localStorage and broadcast on `window` so every component can
 * react to it, the same way the UK/US region preference works.
 */

const STORAGE_KEY = 'gbbo-profile';
export const PROFILE_CHANGE_EVENT = 'gbbo-profile-change';

/**
 * The participant the visitor picked, or null if no one is picked
 * @returns {{id: string, name: string, emoji: string}|null}
 */
export function getProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (error) {
    console.warn('Could not read the saved profile:', error);
    return null;
  }
}

/**
 * Save the picked participant and let every listening component know it changed
 * @param {{id: string, name: string, Emoji?: string}|null} participant - A record from fetchNames, or null to clear the profile
 * @returns {{id: string, name: string, emoji: string}|null} The profile that is now saved
 */
export function setProfile(participant) {
  const profile = participant ? { id: participant.id, name: participant.name, emoji: participant.Emoji || '' } : null;

  try {
    if (profile) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.warn('Could not save the profile:', error);
  }

  window.dispatchEvent(new CustomEvent(PROFILE_CHANGE_EVENT, { detail: { profile } }));
  return profile;
}

/**
 * Clear the picked participant
 */
export function clearProfile() {
  setProfile(null);
}
