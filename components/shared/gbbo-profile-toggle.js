import { LitElement, html, css } from 'lit';
import './gbbo-region-toggle.js';
import { fetchNames } from '../../js/utils/participants.js';
import { PROFILE_CHANGE_EVENT, getProfile, setProfile } from '../../js/utils/profile.js';

// No participant is picked until someone opens the modal and chooses themselves.
const EMPTY_PROFILE_EMOJI = '👤';

/**
 * The nav bar's site settings button. Opens a pop-up where a visitor can
 * switch the UK/US region and pick which participant they are. The profile
 * choice is remembered in localStorage instead of a real login, and other
 * components - like the vote form - read it to pre-fill who is voting.
 */
export class GBBOProfileToggle extends LitElement {
  static properties = {
    profile: { type: Object },
    participants: { type: Array },
    loading: { type: Boolean },
    error: { type: String }
  };

  constructor() {
    super();
    this.profile = getProfile();
    this.participants = [];
    this.loading = false;
    this.error = '';
    this.handleProfileChange = this.handleProfileChange.bind(this);
  }

  static styles = css`
    :host {
      display: inline-flex;
    }

    button.toggle {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: 1px solid rgba(247, 198, 217, 0.6);
      border-radius: 2rem;
      padding: 0.35rem 0.75rem;
      cursor: pointer;
      font-family: inherit;
      font-size: 0.875rem;
      font-weight: 600;
      letter-spacing: 0.05em;
      color: var(--link-text);
      transition: all 0.2s ease;
    }

    button.toggle:hover {
      background-color: rgba(247, 198, 217, 0.2);
      color: var(--link-text-on-hover);
      transform: translateY(-1px);
    }

    button.toggle:focus-visible {
      outline: 2px solid var(--royal-blue);
      outline-offset: 2px;
    }

    .avatar {
      display: block;
      font-size: 1.1rem;
      line-height: 1;
    }

    @media (max-width: 768px) {
      button.toggle {
        padding: 0.3rem 0.5rem;
        gap: 0.35rem;
        font-size: 0.75rem;
      }

      .avatar {
        font-size: 1rem;
      }
    }

    /* A <dialog> renders in the browser's top layer, so it always covers the
       whole viewport - unlike position:fixed, which the header's backdrop-filter
       would otherwise trap inside the nav bar. */
    dialog.modal {
      padding: 0;
      border: none;
      border-radius: 1rem;
      max-width: 420px;
      width: 90%;
      max-height: 80vh;
      background-color: var(--canvas);
      box-shadow: 0 25px 50px -12px rgba(33, 65, 119, 0.25);
    }

    dialog.modal::backdrop {
      background-color: rgba(0, 0, 0, 0.7);
    }

    .modal-content {
      max-height: 80vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.5rem 1.5rem 1rem 1.5rem;
      border-bottom: 1px solid rgba(247, 198, 217, 0.3);
      position: sticky;
      top: 0;
      background-color: var(--canvas);
    }

    .modal-title {
      font-family: 'Playfair Display', serif;
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--heading-text);
      margin: 0;
    }

    .modal-close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--body-text);
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.25rem;
      transition: background-color 0.2s ease, color 0.2s ease;
    }

    .modal-close-button:hover {
      background-color: rgba(247, 198, 217, 0.2);
      color: var(--berry-red);
    }

    .modal-body {
      padding: 0.75rem;
    }

    .modal-hint {
      color: var(--body-text);
      font-size: 0.875rem;
      padding: 0.25rem 0.75rem 0.75rem 0.75rem;
      margin: 0;
    }

    gbbo-region-toggle {
      margin: 0 0.75rem 1rem 0.75rem;
    }

    .participant-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .participant-button {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      background: none;
      border: none;
      text-align: left;
      padding: 0.75rem;
      font-family: inherit;
      font-size: 1rem;
      color: var(--body-text);
      cursor: pointer;
      border-radius: 0.5rem;
      transition: background-color 0.2s ease;
    }

    .participant-button:hover {
      background-color: rgba(190, 228, 210, 0.35);
    }

    .participant-button.selected {
      background-color: rgba(169, 208, 245, 0.35);
      color: var(--heading-text);
      font-weight: 600;
    }

    .participant-emoji {
      font-size: 1.25rem;
      line-height: 1;
      width: 1.5rem;
      text-align: center;
    }

    .participant-name {
      flex: 1;
    }

    .participant-check {
      color: var(--royal-blue);
    }

    .modal-status {
      padding: 1.5rem 0.75rem;
      text-align: center;
      color: var(--body-text);
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(PROFILE_CHANGE_EVENT, this.handleProfileChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener(PROFILE_CHANGE_EVENT, this.handleProfileChange);
  }

  get dialog() {
    return this.renderRoot.querySelector('dialog');
  }

  handleProfileChange(event) {
    this.profile = event.detail.profile;
  }

  // Clicking the backdrop lands on the dialog itself (not .modal-content), since
  // the dialog element's own box is what the top layer renders full-screen behind
  handleDialogClick(e) {
    if (e.target === e.currentTarget) this.closeModal();
  }

  async openModal() {
    this.dialog?.showModal();

    if (this.participants.length === 0) {
      this.loading = true;
      this.error = '';
      try {
        this.participants = await fetchNames();
      } catch (error) {
        console.error('Failed to fetch participants for profile picker:', error);
        this.error = 'Could not load participants. Please try again.';
      } finally {
        this.loading = false;
      }
    }
  }

  closeModal() {
    this.dialog?.close();
  }

  // Picking yourself again logs you out, so the same list doubles as a toggle
  selectParticipant(participant) {
    const isCurrent = this.profile?.id === participant.id;
    this.profile = setProfile(isCurrent ? null : participant);
    this.closeModal();
  }

  render() {
    return html`
      <button
        class="toggle"
        @click="${this.openModal}"
        title="${this.profile ? `Voting as ${this.profile.name}. Click to switch.` : 'Pick who you are'}"
        aria-label="${this.profile ? `Voting as ${this.profile.name}. Click to switch.` : 'Log in: pick who you are'}"
      >
        <span class="avatar">${this.profile ? this.profile.emoji || EMPTY_PROFILE_EMOJI : EMPTY_PROFILE_EMOJI}</span>
        <span>${this.profile ? this.profile.name : 'Log in'}</span>
      </button>

      <dialog class="modal" aria-label="Pick who you are" @click="${this.handleDialogClick}">
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">Who are you?</h2>
            <button class="modal-close-button" @click="${this.closeModal}" aria-label="Close">✕</button>
          </div>
          <div class="modal-body">
            <p class="modal-hint">Regional preference</p>
            <gbbo-region-toggle></gbbo-region-toggle>

            ${this.loading ? html`<div class="modal-status">Loading participants...</div>` : ''}
            ${this.error ? html`<div class="modal-status">${this.error}</div>` : ''}
            ${!this.loading && !this.error ? html`
              <p class="modal-hint">
                ${this.profile ? 'Tap your name again to log out.' : 'Pick your name so we can remember it next time.'}
              </p>
              <ul class="participant-list">
                ${this.participants.map(participant => html`
                  <li>
                    <button
                      class="participant-button ${this.profile?.id === participant.id ? 'selected' : ''}"
                      @click="${() => this.selectParticipant(participant)}"
                    >
                      <span class="participant-emoji">${participant.Emoji || EMPTY_PROFILE_EMOJI}</span>
                      <span class="participant-name">${participant.name}</span>
                      ${this.profile?.id === participant.id ? html`<span class="participant-check">✓</span>` : ''}
                    </button>
                  </li>
                `)}
              </ul>
            ` : ''}
          </div>
        </div>
      </dialog>
    `;
  }
}

customElements.define('gbbo-profile-toggle', GBBOProfileToggle);
