// script.js

// === Configuration for Monthly Unlock Code ===
// !!! IMPORTANT: CHANGE THIS TO A LONG, RANDOM, AND COMPLEX STRING OF YOUR OWN !!!
// Example: "MySecretPhraseForDnDApp2025!@#XYZ"
const SECRET_KEY = "YOUR_SUPER_SECRET_COMPLEX_KEY_HERE_12345!@#$%^&*()";
const UNLOCKED_SESSION_KEY = "isFeaturesUnlocked"; // Key for session storage

// --- Feature Control Functions ---
// This function determines if premium features should be available
function updateFeatureAccess() {
    const isUnlockedInSession = sessionStorage.getItem(UNLOCKED_SESSION_KEY) === "true";
    // Select all elements marked as premium features
    const premiumElements = document.querySelectorAll('[data-feature="premium"]');

    if (isUnlockedInSession) {
        premiumElements.forEach(el => {
            el.classList.remove('feature-locked');
            // For elements that have a message like "Unlock premium features to search monsters!", hide it.
            const lockedMessage = el.querySelector('.feature-locked-message');
            if (lockedMessage) {
                lockedMessage.style.display = 'none';
            }
        });
        console.log("Premium features are active (session unlocked).");
    } else {
        premiumElements.forEach(el => {
            el.classList.add('feature-locked');
            // Show the locked message if it exists
            const lockedMessage = el.querySelector('.feature-locked-message');
            if (lockedMessage) {
                lockedMessage.style.display = 'block';
            }
        });
        console.log("Premium features are locked (session not unlocked).");
    }
}

// Function to unlock features for the current session
function unlockFeaturesForSession() {
    sessionStorage.setItem(UNLOCKED_SESSION_KEY, "true");
    updateFeatureAccess(); // Update UI immediately
}

// === Monthly Code Generation Logic ===
// This function generates a predictable, but hard-to-guess code based on the secret key and the month/year.
// It uses a simple deterministic hashing algorithm (DJB2 variant).
// This is NOT cryptographically secure, but sufficient for a client-side "soft-lock" system.
function generateMonthlyCode(secret, year, month) {
    // Combine components into a single string to form the seed for the hash
    const seed = `${secret}-${year}-${month}`;

    // DJB2 hash algorithm variant
    let hash = 5381; // Initial prime number
    for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) + hash) + seed.charCodeAt(i); // hash * 33 + char
    }

    // Ensure the hash is positive and convert to a fixed-length alphanumeric string (base 36)
    const codeLength = 8; // Desired length of the code (e.g., 8 characters)
    // Use a modulo operation to keep the hash within a predictable range for conversion to base 36
    const maxVal = Math.pow(36, codeLength);
    let result = Math.abs(hash % maxVal).toString(36).toUpperCase();

    // Pad with leading '0's if the result is shorter than desired length
    // This ensures a consistent length for easier user input and verification
    return result.padStart(codeLength, '0');
}


document.addEventListener('DOMContentLoaded', () => {
    // New Dice Roller elements
    const diceNotationInput = document.getElementById('diceNotation');
    const rollDiceBtn = document.getElementById('rollDiceBtn');
    const rollResultDiv = document.getElementById('rollResult');
    const commonRollButtons = document.querySelectorAll('.dice-shortcut');

    // Get references to HTML elements
    const currentRoundSpan = document.getElementById('currentRound');
    const currentTurnSpan = document.getElementById('currentTurn');
    const combatantsList = document.getElementById('combatantsList'); // Corrected from combatantList

    // Modal-related elements
    const openPcModalBtn = document.getElementById('openPcModalBtn');
    const openMonsterModalBtn = document.getElementById('openMonsterModalBtn');
    const modalPcAdd = document.getElementById('modal-pc-add');
    const modalMonsterAdd = document.getElementById('modal-monster-add');
    const modalEditCombatant = document.getElementById('modal-edit-combatant');
    const modalConditionDescription = document.getElementById('modal-condition-description');
    const modalAddCondition = document.getElementById('modal-add-condition');
    const modalClearConfirmation = document.getElementById('modal-clear-confirmation');
    const modalMonsterFullDetails = document.getElementById('modal-monster-full-details');
    const modalMessage = document.getElementById('modal-message');
    const messageModalCloseBtn = document.getElementById('messageModalCloseBtn');
    const messageModalTitle = document.getElementById('messageModalTitle');
    const messageModalText = document.getElementById('messageModalText');
    const modalConfirmation = document.getElementById('modal-confirmation');
    const confirmationModalTitle = document.getElementById('confirmationModalTitle');
    const confirmationModalText = document.getElementById('confirmationModalText');
    const confirmationModalConfirmBtn = document.getElementById('confirmationModalConfirmBtn');
    const confirmationModalCancelBtn = document.getElementById('confirmationModalCancelBtn');


    const closeButtons = document.querySelectorAll('.close-button');

    // PC Modal Inputs
    const pcNameModalInput = document.getElementById('pcName');
    const pcMaxHpModalInput = document.getElementById('pcHP');
    const pcAcModalInput = document.getElementById('pcAC');
    const pcInitiativeBonusModalInput = document.getElementById('pcInitiative');
    const addPcModalBtn = document.querySelector('#modal-pc-add button[type="submit"]');

    // Monster Modal Inputs
    const monsterSearchInput = document.getElementById('monsterSearchInput');
    const monsterSearchResults = document.getElementById('monsterSearchResults');
    const monsterNameModalInput = document.getElementById('monsterName');
    const monsterInitiativeModalInput = document.getElementById('monsterInitiative');
    const monsterHpModalInput = document.getElementById('monsterHP');
    const monsterAcModalInput = document.getElementById('monsterAC');
    const addMonsterModalBtn = document.querySelector('#modal-monster-add button[type="submit"]');

    // Edit Combatant Modal elements
    const editCombatantIdInput = document.getElementById('editCombatantId');
    const editNameModalInput = document.getElementById('editCombatantName');
    const editInitiativeModalInput = document.getElementById('editCombatantInitiative');
    const editHpModalInput = document.getElementById('editCombatantHP');
    const editMaxHpModalInput = document.getElementById('editCombatantAC'); // This was previously maxHp, but HTML uses AC. Re-evaluate if you have a separate max HP field in edit modal. Assuming AC for now.
    const editAcModal = document.getElementById('editCombatantAC'); // Corrected variable name, same as above
    const editTempHpModalInput = document.getElementById('editTempHpModal'); // This element doesn't exist in the provided HTML. It will be null.
    const saveEditCombatantBtn = document.querySelector('#modal-edit-combatant button[type="submit"]');
    let editingCombatantId = null; // To keep track of which combatant is being edited

    // Condition Description Modal elements
    const conditionDescriptionTitle = document.getElementById('conditionDescriptionTitle');
    const conditionDescriptionText = document.getElementById('conditionDescriptionText');

    // Add Condition Modal elements
    const addConditionCombatantIdInput = document.getElementById('addConditionCombatantId'); // Corrected ID
    const conditionSelect = document.getElementById('conditionSelect'); // Corrected ID
    const conditionDurationInput = document.getElementById('conditionDuration'); // Corrected ID
    const addConditionBtn = document.getElementById('addConditionBtn'); // Corrected ID
    let selectedCombatantIdForCondition = null; // To track which combatant is being edited for conditions


    // Clear Confirmation Modal elements
    const clearAllBtn = document.getElementById('clearAllBtn');
    const clearMonstersBtn = document.getElementById('clearMonstersBtn');
    const cancelClearBtn = document.getElementById('cancelClearBtn'); // Corrected ID

    // Monster Full Details Modal elements
    const monsterDetailsName = document.getElementById('monsterDetailsName');
    const monsterDetailsContent = document.getElementById('monsterDetailsContent');

    const startCombatBtn = document.getElementById('startCombatBtn');
    const nextTurnBtn = document.getElementById('nextTurnBtn');
    const prevTurnBtn = document.getElementById('prevTurnBtn');


    // New elements for Monthly Code Unlock
    const monthlyCodeInput = document.getElementById('monthlyCodeInput');
    const unlockMonthlyCodeBtn = document.getElementById('unlockMonthlyCodeBtn');
    const monthlyCodeMessage = document.getElementById('monthlyCodeMessage');
    const openUnlockModalBtn = document.getElementById('openUnlockModalBtn'); // New button to open the unlock modal
    const modalMonthlyUnlock = document.getElementById('modal-monthly-unlock'); // New modal for unlock code

    // --- State Variables ---
    let combatants = [];
    let currentTurnIndex = -1;
    let currentRound = 1;
    let allMonsters = []; // To store fetched monster data
    let allConditions = []; // To store fetched condition data

    const DND_API_BASE_URL = 'https://www.dnd5eapi.co/api';

    // --- Utility Functions ---

    // Function to open a modal
    function openModal(modalElement) {
        modalElement.style.display = 'block';
        // Add a class to body to prevent scrolling
        document.body.classList.add('modal-open');
    }

    // Function to close a modal
    function closeModal(modalElement) {
        modalElement.style.display = 'none';
        // Remove the class from body
        document.body.classList.remove('modal-open');
    }

    // Generic Message Modal
    function openMessageModal(title, message) {
        messageModalTitle.textContent = title;
        messageModalText.textContent = message;
        openModal(modalMessage);
    }

    // Confirmation Modal
    function openConfirmationModal(title, message, onConfirm, onCancel) {
        confirmationModalTitle.textContent = title;
        confirmationModalText.textContent = message;
        openModal(modalClearConfirmation);

        // Clear previous listeners to prevent multiple calls
        confirmationModalConfirmBtn.onclick = null;
        confirmationModalCancelBtn.onclick = null;

        confirmationModalConfirmBtn.onclick = () => {
            onConfirm();
            closeModal(modalClearConfirmation);
        };
        confirmationModalCancelBtn.onclick = () => {
            onCancel();
            closeModal(modalClearConfirmation);
        };
    }


    // --- Data Persistence (Local Storage) ---
    function saveEncounter() {
        localStorage.setItem('combatants', JSON.stringify(combatants));
        localStorage.setItem('currentTurnIndex', currentTurnIndex.toString());
        localStorage.setItem('currentRound', currentRound.toString());
    }

    function loadEncounter() {
        const savedCombatants = localStorage.getItem('combatants');
        const savedTurnIndex = localStorage.getItem('currentTurnIndex');
        const savedRound = localStorage.getItem('currentRound');

        if (savedCombatants) {
            combatants = JSON.parse(savedCombatants);
        }
        if (savedTurnIndex !== null) {
            currentTurnIndex = parseInt(savedTurnIndex);
        }
        if (savedRound !== null) {
            currentRound = parseInt(savedRound);
        }
        renderCombatants();
        updateTurnDisplay();
    }

    // --- Combatant Management ---

    function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    function addCombatant(name, initiative, hp, ac, isPC = false) {
        const id = generateUniqueId();
        combatants.push({ id, name, initiative: parseInt(initiative), hp: hp !== '' ? parseInt(hp) : null, ac: ac !== '' ? parseInt(ac) : null, isPC, conditions: [] });
        sortCombatants();
        renderCombatants();
        saveEncounter();
        openMessageModal('Combatant Added', `${name} added to combat!`);
    }

    function sortCombatants() {
        combatants.sort((a, b) => {
            // Sort by initiative (descending)
            if (b.initiative !== a.initiative) {
                return b.initiative - a.initiative;
            }
            // Then by PC first, then monster
            if (a.isPC && !b.isPC) return -1;
            if (!a.isPC && b.isPC) return 1;
            // Then by name (alphabetical)
            return a.name.localeCompare(b.name);
        });
    }

    function renderCombatants() {
        combatantsList.innerHTML = ''; // Clear current list
        if (combatants.length === 0) {
            combatantsList.innerHTML = '<p class="empty-list-message">No combatants yet. Add PCs or Monsters!</p>';
            return;
        }

        combatants.forEach((combatant, index) => {
            const combatantDiv = document.createElement('div');
            combatantDiv.classList.add('combatant-item', 'card');
            if (index === currentTurnIndex) {
                combatantDiv.classList.add('current-turn');
            }
            if (combatant.isPC) {
                combatantDiv.classList.add('pc');
            } else {
                combatantDiv.classList.add('monster');
            }

            combatantDiv.innerHTML = `
                <div class="combatant-info">
                    <div class="combatant-name-initiative">
                        <span class="name">${combatant.name}</span>
                        <span class="initiative">(Init: ${combatant.initiative})</span>
                    </div>
                    <div class="combatant-stats">
                        ${combatant.hp !== null ? `<span class="hp">HP: ${combatant.hp}</span>` : ''}
                        ${combatant.ac !== null ? `<span class="ac">AC: ${combatant.ac}</span>` : ''}
                    </div>
                    <div class="combatant-conditions" id="conditions-${combatant.id}">
                        ${combatant.conditions.map(c => `
                            <span class="condition-tag" data-condition-id="${c.id}" data-condition-name="${c.name}" data-condition-duration="${c.duration}">
                                ${c.name} ${c.duration !== null ? `(${c.duration})` : ''}
                                <i data-lucide="x" class="remove-condition-btn" data-combatant-id="${combatant.id}" data-condition-id="${c.id}"></i>
                            </span>
                        `).join('')}
                    </div>
                </div>
                <div class="combatant-actions">
                    <button class="button button-edit edit-combatant-btn" data-id="${combatant.id}"><i data-lucide="edit"></i></button>
                    <button class="button button-danger remove-combatant-btn" data-id="${combatant.id}"><i data-lucide="trash-2"></i></button>
                </div>
            `;
            combatantsList.appendChild(combatantDiv);
        });
        lucide.createIcons(); // Re-render Lucide icons for newly added elements
    }

    function updateTurnDisplay() {
        currentRoundSpan.textContent = currentRound;
        if (currentTurnIndex !== -1 && combatants[currentTurnIndex]) {
            currentTurnSpan.textContent = combatants[currentTurnIndex].name;
        } else {
            currentTurnSpan.textContent = 'None';
        }
    }

    function nextTurn() {
        if (combatants.length === 0) {
            openMessageModal('No Combatants', 'Please add combatants to start combat.');
            return;
        }

        if (currentTurnIndex === -1 || currentTurnIndex === combatants.length - 1) {
            currentTurnIndex = 0;
            currentRound++;
            openMessageModal('New Round', `Starting Round ${currentRound}!`);
            updateConditions(); // Update conditions at the start of a new round
        } else {
            currentTurnIndex++;
        }
        updateTurnDisplay();
        renderCombatants(); // Re-render to highlight current turn
        saveEncounter();
    }

    function prevTurn() {
        if (combatants.length === 0) {
            openMessageModal('No Combatants', 'Please add combatants to start combat.');
            return;
        }

        if (currentTurnIndex === 0) {
            if (currentRound > 1) {
                currentTurnIndex = combatants.length - 1;
                currentRound--;
                openMessageModal('Previous Round', `Back to Round ${currentRound}.`);
            } else {
                openMessageModal('First Round', 'Cannot go to a previous round.');
            }
        } else if (currentTurnIndex === -1) {
            // If combat hasn't started, go to the last combatant of round 1
            currentTurnIndex = combatants.length - 1;
        } else {
            currentTurnIndex--;
        }
        updateTurnDisplay();
        renderCombatants();
        saveEncounter();
    }

    function updateConditions() {
        combatants.forEach(combatant => {
            combatant.conditions = combatant.conditions.filter(condition => {
                if (condition.duration !== null) {
                    condition.duration--;
                    if (condition.duration <= 0) {
                        openMessageModal('Condition Expired', `${combatant.name}'s ${condition.name} condition has expired!`);
                        return false; // Remove condition
                    }
                }
                return true; // Keep condition
            });
        });
        renderCombatants();
        saveEncounter();
    }

    // --- Dice Roller Logic ---
    function rollDice(notation) {
        notation = notation.toLowerCase();
        const parts = notation.match(/^(\d*)d(\d+)([+-]\d+)?$/);

        if (!parts) {
            rollResultDiv.textContent = 'Invalid dice notation. Use format like "1d20" or "2d6+3".';
            return;
        }

        const numDice = parseInt(parts[1] || '1');
        const dieType = parseInt(parts[2]);
        const modifier = parseInt(parts[3] || '0');

        if (numDice <= 0 || dieType <= 0) {
            rollResultDiv.textContent = 'Number of dice and die type must be positive.';
            return;
        }

        let totalRoll = 0;
        let rolls = [];
        for (let i = 0; i < numDice; i++) {
            const roll = Math.floor(Math.random() * dieType) + 1;
            rolls.push(roll);
            totalRoll += roll;
        }

        const finalResult = totalRoll + modifier;
        rollResultDiv.textContent = `Roll: ${rolls.join(' + ')}${modifier !== 0 ? (modifier > 0 ? ' + ' : ' - ') + Math.abs(modifier) : ''} = ${finalResult}`;
    }

    // --- Fetch Data from D&D 5e API ---
    async function fetchAllMonsters() {
        try {
            const response = await fetch(`${DND_API_BASE_URL}/monsters`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            allMonsters = data.results; // Store all monster names and URLs
            console.log('Monsters fetched:', allMonsters.length);
        } catch (error) {
            console.error('Error fetching monsters:', error);
            openMessageModal('Error', 'Failed to fetch monster data. Please check your internet connection.');
        }
    }

    async function fetchMonsterDetails(url) {
        try {
            const response = await fetch(`https://www.dnd5eapi.co${url}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching monster details:', error);
            openMessageModal('Error', 'Failed to fetch monster details.');
            return null;
        }
    }

    async function fetchAllConditions() {
        try {
            const response = await fetch(`${DND_API_BASE_URL}/conditions`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            allConditions = data.results; // Store all condition names and URLs
            populateConditionSelect(); // Populate the select dropdown
            console.log('Conditions fetched:', allConditions.length);
        } catch (error) {
            console.error('Error fetching conditions:', error);
            openMessageModal('Error', 'Failed to fetch condition data. Please check your internet connection.');
        }
    }

    async function fetchConditionDetails(url) {
        try {
            const response = await fetch(`https://www.dnd5eapi.co${url}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching condition details:', error);
            openMessageModal('Error', 'Failed to fetch condition details.');
            return null;
        }
    }

    function populateConditionSelect() {
        conditionSelect.innerHTML = '<option value="">Select a condition</option>';
        allConditions.forEach(condition => {
            const option = document.createElement('option');
            option.value = condition.index;
            option.textContent = condition.name;
            conditionSelect.appendChild(option);
        });
    }

    // --- Event Listeners ---

    // Close buttons for modals
    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', (event) => {
            const modalId = event.currentTarget.dataset.modal;
            const modalElement = document.getElementById(modalId);
            if (modalElement) {
                closeModal(modalElement);
            }
        });
    });

    messageModalCloseBtn.addEventListener('click', () => closeModal(modalMessage));

    // Open PC Add Modal
    openPcModalBtn.addEventListener('click', () => openModal(modalPcAdd));

    // Open Monster Add Modal
    openMonsterModalBtn.addEventListener('click', () => openModal(modalMonsterAdd));

    // Handle PC Form Submission
    const pcForm = document.getElementById('pcForm'); // Get the form element
    pcForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addCombatant(pcNameModalInput.value, pcInitiativeBonusModalInput.value, pcMaxHpModalInput.value, pcAcModalInput.value, true);
        pcNameModalInput.value = '';
        pcInitiativeBonusModalInput.value = '';
        pcMaxHpModalInput.value = '';
        pcAcModalInput.value = '';
        closeModal(modalPcAdd);
    });

    // Handle Monster Form Submission
    const monsterForm = document.getElementById('monsterForm'); // Get the form element
    monsterForm.addEventListener('submit', (event) => {
        event.preventDefault();
        addCombatant(monsterNameModalInput.value, monsterInitiativeModalInput.value, monsterHpModalInput.value, monsterAcModalInput.value, false);
        monsterNameModalInput.value = '';
        monsterInitiativeModalInput.value = '';
        monsterHpModalInput.value = '';
        monsterAcModalInput.value = '';
        closeModal(modalMonsterAdd);
    });

    // Start Combat
    startCombatBtn.addEventListener('click', () => {
        if (combatants.length === 0) {
            openMessageModal('Cannot Start', 'Add combatants to start combat!');
            return;
        }
        currentRound = 1;
        currentTurnIndex = -1; // Reset to -1 so nextTurn starts at 0 and round 1
        nextTurn(); // Start first turn of first round
        openMessageModal('Combat Started', 'Initiative order set! Let the battle begin!');
    });

    // Next Turn
    nextTurnBtn.addEventListener('click', nextTurn);

    // Previous Turn
    prevTurnBtn.addEventListener('click', prevTurn);

    // Clear All Combatants
    clearAllBtn.addEventListener('click', () => {
        openConfirmationModal(
            'Clear All Combatants',
            'This will remove ALL combatants from the encounter. Are you sure?',
            () => {
                combatants = [];
                currentTurnIndex = -1;
                currentRound = 1;
                renderCombatants();
                updateTurnDisplay();
                saveEncounter();
                openMessageModal('All Cleared', 'All combatants cleared!');
            },
            () => {
                // User cancelled
            }
        );
    });

    // Clear Monsters Only
    clearMonstersBtn.addEventListener('click', () => {
        openConfirmationModal(
            'Clear Monsters',
            'This will remove only monster combatants from the encounter. Are you sure?',
            () => {
                combatants = combatants.filter(c => c.isPC); // Keep only PCs
                // Re-evaluate current turn index if the current combatant was a monster
                if (currentTurnIndex !== -1 && !combatants[currentTurnIndex]?.isPC) {
                    currentTurnIndex = -1; // Reset turn if current was a monster
                }
                renderCombatants();
                saveEncounter();
                openMessageModal('Monsters Cleared', 'Monsters cleared from combat!');
            },
            () => {
                // User cancelled
            }
        );
    });


    // Delegate event for Edit/Remove Combatant buttons
    combatantsList.addEventListener('click', async (event) => {
        // Edit Combatant
        if (event.target.closest('.edit-combatant-btn')) {
            const combatantId = event.target.closest('.edit-combatant-btn').dataset.id;
            const combatantToEdit = combatants.find(c => c.id === combatantId);

            if (combatantToEdit) {
                editCombatantIdInput.value = combatantToEdit.id;
                editNameModalInput.value = combatantToEdit.name;
                editInitiativeModalInput.value = combatantToEdit.initiative;
                editHpModalInput.value = combatantToEdit.hp !== null ? combatantToEdit.hp : '';
                editMaxHpModalInput.value = combatantToEdit.ac !== null ? combatantToEdit.ac : ''; // Assuming this is AC
                editAcModal.value = combatantToEdit.ac !== null ? combatantToEdit.ac : ''; // Assuming this is AC

                // Render conditions for editing
                const editCombatantConditionsList = document.getElementById('editCombatantConditionsList'); // Get the element
                editCombatantConditionsList.innerHTML = '';
                combatantToEdit.conditions.forEach(c => {
                    const conditionTag = document.createElement('span');
                    conditionTag.classList.add('condition-tag');
                    conditionTag.innerHTML = `
                        ${c.name} ${c.duration !== null ? `(${c.duration})` : ''}
                        <i data-lucide="x" class="remove-condition-btn" data-combatant-id="${combatantToEdit.id}" data-condition-id="${c.id}"></i>
                    `;
                    editCombatantConditionsList.appendChild(conditionTag);
                });
                lucide.createIcons(); // Re-render Lucide icons

                selectedCombatantIdForCondition = combatantId; // Set for adding new conditions
                openModal(modalEditCombatant);
            }
        }
        // Remove Combatant
        else if (event.target.closest('.remove-combatant-btn')) {
            const combatantId = event.target.closest('.remove-combatant-btn').dataset.id;
            const combatantName = combatants.find(c => c.id === combatantId)?.name || 'Combatant';

            openConfirmationModal(
                'Remove Combatant',
                `Are you sure you want to remove ${combatantName} from combat?`,
                () => {
                    combatants = combatants.filter(c => c.id !== combatantId);
                    // Adjust currentTurnIndex if the removed combatant was before the current turn
                    if (currentTurnIndex !== -1) {
                        const removedIndex = combatants.findIndex(c => c.id === combatantId);
                        if (removedIndex !== -1 && removedIndex < currentTurnIndex) {
                            currentTurnIndex--;
                        }
                        if (currentTurnIndex >= combatants.length) { // If last combatant was removed
                            currentTurnIndex = combatants.length > 0 ? 0 : -1;
                        }
                    }
                    renderCombatants();
                    updateTurnDisplay();
                    saveEncounter();
                    openMessageModal('Combatant Removed', `${combatantName} removed.`);
                },
                () => {
                    // User cancelled
                }
            );
        }
        // Remove Condition from Combatant (within the edit modal)
        else if (event.target.closest('.remove-condition-btn')) {
            const combatantId = event.target.closest('.remove-condition-btn').dataset.combatantId;
            const conditionId = event.target.closest('.remove-condition-btn').dataset.conditionId;

            const combatant = combatants.find(c => c.id === combatantId);
            if (combatant) {
                combatant.conditions = combatant.conditions.filter(c => c.id !== conditionId);
                renderCombatants(); // Re-render main list to update conditions
                // Also update conditions in the edit modal if it's open
                const combatantToEdit = combatants.find(c => c.id === selectedCombatantIdForCondition);
                if (combatantToEdit) {
                    const editCombatantConditionsList = document.getElementById('editCombatantConditionsList'); // Get the element
                    editCombatantConditionsList.innerHTML = '';
                    combatantToEdit.conditions.forEach(c => {
                        const conditionTag = document.createElement('span');
                        conditionTag.classList.add('condition-tag');
                        conditionTag.innerHTML = `
                            ${c.name} ${c.duration !== null ? `(${c.duration})` : ''}
                            <i data-lucide="x" class="remove-condition-btn" data-combatant-id="${combatantToEdit.id}" data-condition-id="${c.id}"></i>
                        `;
                        editCombatantConditionsList.appendChild(conditionTag);
                    });
                    lucide.createIcons();
                }
                saveEncounter();
                openMessageModal('Condition Removed', 'Condition removed successfully.');
            }
        }
        // Show Condition Description
        else if (event.target.closest('.condition-tag')) {
            const conditionName = event.target.closest('.condition-tag').dataset.conditionName;
            const condition = allConditions.find(c => c.name === conditionName);
            if (condition) {
                const details = await fetchConditionDetails(condition.url);
                if (details) {
                    document.getElementById('conditionDescriptionTitle').textContent = details.name;
                    document.getElementById('conditionDescriptionText').innerHTML = details.desc.map(p => `<p>${p}</p>`).join('');
                    openModal(modalConditionDescription);
                }
            }
        }
    });

    // Handle Edit Combatant Form Submission
    const editCombatantForm = document.getElementById('editCombatantForm'); // Get the form element
    editCombatantForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const id = editCombatantIdInput.value;
        const combatantIndex = combatants.findIndex(c => c.id === id);

        if (combatantIndex !== -1) {
            combatants[combatantIndex].name = editNameModalInput.value;
            combatants[combatantIndex].initiative = parseInt(editInitiativeModalInput.value);
            combatants[combatantIndex].hp = editHpModalInput.value !== '' ? parseInt(editHpModalInput.value) : null;
            combatants[combatantIndex].ac = editMaxHpModalInput.value !== '' ? parseInt(editMaxHpModalInput.value) : null; // Assuming this is AC
            sortCombatants();
            renderCombatants();
            updateTurnDisplay(); // In case initiative changed and turn order shifted
            saveEncounter();
            closeModal(modalEditCombatant);
            openMessageModal('Combatant Updated', `${combatants[combatantIndex].name} updated!`);
        }
    });

    // Open Add Condition Modal from Edit Combatant Modal
    const openAddConditionModalBtn = document.getElementById('openAddConditionModalBtn'); // Get the button
    openAddConditionModalBtn.addEventListener('click', () => {
        addConditionCombatantIdInput.value = selectedCombatantIdForCondition;
        openModal(modalAddCondition);
    });

    // Add Condition to Combatant
    addConditionBtn.addEventListener('click', () => {
        const combatantId = addConditionCombatantIdInput.value;
        const selectedConditionIndex = conditionSelect.value;
        const duration = conditionDurationInput.value !== '' ? parseInt(conditionDurationInput.value) : null;

        if (!selectedConditionIndex) {
            openMessageModal('Error', 'Please select a condition.');
            return;
        }

        const combatant = combatants.find(c => c.id === combatantId);
        const conditionDetails = allConditions.find(c => c.index === selectedConditionIndex);

        if (combatant && conditionDetails) {
            // Check if condition already exists to prevent duplicates
            if (combatant.conditions.some(c => c.name === conditionDetails.name)) {
                openMessageModal('Condition Exists', `${combatant.name} already has the ${conditionDetails.name} condition.`);
                return;
            }

            combatant.conditions.push({
                id: generateUniqueId(), // Unique ID for this specific condition instance
                name: conditionDetails.name,
                duration: duration
            });
            renderCombatants(); // Re-render main list
            // Re-render conditions in the edit modal if it's still open
            const combatantToEdit = combatants.find(c => c.id === selectedCombatantIdForCondition);
            if (combatantToEdit) {
                const editCombatantConditionsList = document.getElementById('editCombatantConditionsList'); // Get the element
                editCombatantConditionsList.innerHTML = '';
                combatantToEdit.conditions.forEach(c => {
                    const conditionTag = document.createElement('span');
                    conditionTag.classList.add('condition-tag');
                    conditionTag.innerHTML = `
                        ${c.name} ${c.duration !== null ? `(${c.duration})` : ''}
                        <i data-lucide="x" class="remove-condition-btn" data-combatant-id="${combatantToEdit.id}" data-condition-id="${c.id}"></i>
                    `;
                    editCombatantConditionsList.appendChild(conditionTag);
                });
                lucide.createIcons();
            }
            saveEncounter();
            closeModal(modalAddCondition);
            openMessageModal('Condition Added', `${conditionDetails.name} added to ${combatant.name}.`);
            conditionDurationInput.value = ''; // Clear duration input
            conditionSelect.value = ''; // Reset select
        }
    });


    // Dice Roller Button
    rollDiceBtn.addEventListener('click', () => {
        rollDice(diceNotationInput.value);
    });

    // Common Roll Buttons
    commonRollButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            rollDice(event.target.dataset.roll);
        });
    });

    // Monster Search
    const monsterSearchBtn = document.getElementById('monsterSearchBtn'); // Get the button
    monsterSearchBtn.addEventListener('click', async () => {
        const searchTerm = monsterSearchInput.value.trim().toLowerCase();
        monsterSearchResults.innerHTML = ''; // Clear previous results

        if (!searchTerm) {
            monsterSearchResults.innerHTML = '<p class="message-text">Please enter a monster name to search.</p>';
            return;
        }

        const filteredMonsters = allMonsters.filter(monster =>
            monster.name.toLowerCase().includes(searchTerm)
        );

        if (filteredMonsters.length === 0) {
            monsterSearchResults.innerHTML = '<p class="message-text">No monsters found matching your search.</p>';
            return;
        }

        filteredMonsters.forEach(monster => {
            const resultItem = document.createElement('div');
            resultItem.classList.add('search-result-item', 'card');
            resultItem.innerHTML = `
                <span>${monster.name}</span>
                <button class="button button-secondary view-monster-details-btn" data-url="${monster.url}">View Details</button>
            `;
            monsterSearchResults.appendChild(resultItem);
        });
    });

    // Delegate event for View Monster Details button
    monsterSearchResults.addEventListener('click', async (event) => {
        if (event.target.closest('.view-monster-details-btn')) {
            const monsterUrl = event.target.closest('.view-monster-details-btn').dataset.url;
            const monsterDetails = await fetchMonsterDetails(monsterUrl);

            if (monsterDetails) {
                monsterDetailsName.textContent = monsterDetails.name;
                monsterDetailsContent.innerHTML = `
                    <p><strong>Size:</strong> ${monsterDetails.size}</p>
                    <p><strong>Type:</strong> ${monsterDetails.type}</p>
                    <p><strong>Alignment:</strong> ${monsterDetails.alignment}</p>
                    <p><strong>Armor Class:</strong> ${monsterDetails.armor_class[0]?.value || 'N/A'} (${monsterDetails.armor_class[0]?.type || ''})</p>
                    <p><strong>Hit Points:</strong> ${monsterDetails.hit_points} (${monsterDetails.hit_points_roll})</p>
                    <p><strong>Speed:</strong> ${Object.entries(monsterDetails.speed).map(([key, value]) => `${key}: ${value}`).join(', ')}</p>
                    <p><strong>Strength:</strong> ${monsterDetails.strength}</p>
                    <p><strong>Dexterity:</strong> ${monsterDetails.dexterity}</p>
                    <p><strong>Constitution:</strong> ${monsterDetails.constitution}</p>
                    <p><strong>Intelligence:</strong> ${monsterDetails.intelligence}</p>
                    <p><strong>Wisdom:</strong> ${monsterDetails.wisdom}</p>
                    <p><strong>Charisma:</strong> ${monsterDetails.charisma}</p>
                    ${monsterDetails.proficiencies.length > 0 ? `
                        <p><strong>Proficiencies:</strong></p>
                        <ul>
                            ${monsterDetails.proficiencies.map(p => `<li>${p.proficiency.name.replace('Saving Throw: ', '')} +${p.value}</li>`).join('')}
                        </ul>
                    ` : ''}
                    ${monsterDetails.senses ? `<p><strong>Senses:</strong> ${monsterDetails.senses}</p>` : ''}
                    ${monsterDetails.languages ? `<p><strong>Languages:</strong> ${monsterDetails.languages}</p>` : ''}
                    ${monsterDetails.challenge_rating ? `<p><strong>Challenge Rating:</strong> ${monsterDetails.challenge_rating} (${monsterDetails.xp} XP)</p>` : ''}
                    ${monsterDetails.special_abilities.length > 0 ? `
                        <h3>Special Abilities:</h3>
                        ${monsterDetails.special_abilities.map(ability => `
                            <h4>${ability.name}</h4>
                            <p>${ability.desc}</p>
                        `).join('')}
                    ` : ''}
                    ${monsterDetails.actions.length > 0 ? `
                        <h3>Actions:</h3>
                        ${monsterDetails.actions.map(action => `
                            <h4>${action.name}</h4>
                            <p>${action.desc}</p>
                            ${action.damage && action.damage.length > 0 ? `
                                <ul>
                                    ${action.damage.map(d => `<li>${d.damage_dice} ${d.damage_type ? `(${d.damage_type.name})` : ''}</li>`).join('')}
                                </ul>
                            ` : ''}
                        `).join('')}
                    ` : ''}
                    ${monsterDetails.legendary_actions && monsterDetails.legendary_actions.length > 0 ? `
                        <h3>Legendary Actions:</h3>
                        ${monsterDetails.legendary_actions.map(action => `
                            <h4>${action.name}</h4>
                            <p>${action.desc}</p>
                        `).join('')}
                    ` : ''}
                `;
                openModal(modalMonsterFullDetails);
            }
        }
    });

    // --- Monthly Code Unlock Event Listener ---
    // Button to open the unlock modal
    if (openUnlockModalBtn) {
        openUnlockModalBtn.addEventListener('click', () => {
            openModal(modalMonthlyUnlock);
            monthlyCodeInput.focus(); // Focus on the input when modal opens
        });
    }

    // Unlock button inside the modal
    if (unlockMonthlyCodeBtn) {
        unlockMonthlyCodeBtn.addEventListener('click', () => {
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth() + 1; // getMonth() is 0-indexed (0=Jan, 11=Dec)

            const expectedCode = generateMonthlyCode(SECRET_KEY, currentYear, currentMonth);
            const enteredCode = monthlyCodeInput.value.trim().toUpperCase(); // Convert input to uppercase for case-insensitive comparison

            if (enteredCode === expectedCode) {
                monthlyCodeMessage.textContent = "Features unlocked for this session! Enjoy your premium tools.";
                monthlyCodeMessage.style.color = "green";
                unlockFeaturesForSession(); // Unlock features and update UI
                closeModal(modalMonthlyUnlock); // Close the modal on success
                openMessageModal('Success!', 'Premium features are now unlocked for this session!');
            } else {
                monthlyCodeMessage.textContent = "Invalid code. Please try again or check the latest Patreon post for the current month's code.";
                monthlyCodeMessage.style.color = "red";
                // If an incorrect code is entered, ensure features are locked.
                sessionStorage.removeItem(UNLOCKED_SESSION_KEY);
                updateFeatureAccess();
            }
        });
    }

    // --- Initial setup when DOM is ready ---
    loadEncounter();
    fetchAllMonsters();
    fetchAllConditions(); // Fetch all conditions on load

    // Ensure feature access is updated based on session storage on page load
    updateFeatureAccess();
});

// --- Patreon Integration (REMOVED) ---
// All Patreon-related functions and variables have been removed as per your request
// to use a free, automated, and non-Patreon dependent solution.
