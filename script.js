// script.js
document.addEventListener('DOMContentLoaded', () => {
    // New Dice Roller elements
    const diceNotationInput = document.getElementById('diceNotation');
    const rollDiceBtn = document.getElementById('rollDiceBtn');
    const rollResultDiv = document.getElementById('rollResult');
    const commonRollButtons = document.querySelectorAll('.dice-shortcut');

    // Get references to HTML elements
    const currentRoundSpan = document.getElementById('currentRound');
    const currentTurnSpan = document.getElementById('currentTurn');

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
    const messageModalTitle = document.getElementById('messageModalTitle');
    const messageModalText = document.getElementById('messageModalText');
    const messageModalCloseBtn = document.getElementById('messageModalCloseBtn');
    const modalConfirmation = document.getElementById('modal-confirmation');
    const confirmationModalTitle = document.getElementById('confirmationModalTitle');
    const confirmationModalText = document.getElementById('confirmationModalText');
    const confirmationModalConfirmBtn = document.getElementById('confirmationModalConfirmBtn');
    const confirmationModalCancelBtn = document.getElementById('confirmationModalCancelBtn');


    const closeButtons = document.querySelectorAll('.close-button');

    // PC Modal Inputs
    const pcNameModalInput = document.getElementById('pcNameModal');
    const pcMaxHpModalInput = document.getElementById('pcMaxHpModal');
    const pcAcModalInput = document.getElementById('pcAcModal');
    const pcInitiativeBonusModalInput = document.getElementById('pcInitiativeBonusModal');
    const addPcModalBtn = document.getElementById('addPcModalBtn');

    // Monster Modal Inputs
    const monsterSearchInput = document.getElementById('monsterSearchInput');
    const monsterSearchResults = document.getElementById('monsterSearchResults');
    const monsterNameModalInput = document.getElementById('monsterNameModal'); // For custom monster name
    const monsterInitiativeModalInput = document.getElementById('monsterInitiativeModal'); // For custom monster init
    const monsterHpModalInput = document.getElementById('monsterHpModal'); // For custom monster HP
    const monsterAcModalInput = document.getElementById('monsterAcModal'); // For custom monster AC
    const addMonsterModalBtn = document.getElementById('addMonsterModalBtn');

    // Edit Combatant Modal elements
    const editCombatantIdInput = document.getElementById('editCombatantId');
    const editNameModalInput = document.getElementById('editNameModal');
    const editInitiativeModalInput = document.getElementById('editInitiativeModal');
    const editHpModalInput = document.getElementById('editHpModal');
    const editMaxHpModalInput = document.getElementById('editMaxHpModal');
    const editAcModal = document.getElementById('editAcModal'); // Corrected variable name
    const editTempHpModalInput = document.getElementById('editTempHpModal');
    const saveEditCombatantBtn = document.getElementById('saveEditCombatantBtn');
    let editingCombatantId = null; // To keep track of which combatant is being edited

    // Condition Description Modal elements
    const conditionDescriptionTitle = document.getElementById('conditionDescriptionTitle');
    const conditionDescriptionText = document.getElementById('conditionDescriptionText');

    // Add Condition Modal elements
    const addConditionCombatantNameSpan = document.getElementById('addConditionCombatantName');
    const addConditionSearchInput = document.getElementById('addConditionSearchInput');
    const conditionSelectionGrid = document.getElementById('conditionSelectionGrid');
    const conditionDurationInput = document.getElementById('conditionDurationInput');
    const applyConditionBtn = document.getElementById('applyConditionBtn');
    let currentCombatantForCondition = null; // Stores the combatant object for the add condition modal
    let selectedConditionsForAdd = []; // Stores selected condition objects from the list (for multiple selection)

    // Clear Confirmation Modal elements
    const clearAllCombatantsBtn = document.getElementById('clearAllCombatantsBtn');
    const clearMonstersBtn = document.getElementById('clearMonstersBtn');
    const cancelClearBtn = document.getElementById('cancelClearBtn');

    // Monster Full Details Modal elements
    const monsterDetailsName = document.getElementById('monsterDetailsName');
    const monsterDetailsContent = document.getElementById('monsterDetailsContent');

    const combatantList = document.getElementById('combatantList');
    const sortInitiativeBtn = document.getElementById('sortInitiativeBtn');
    const rollMonsterInitiativeBtn = document.getElementById('rollMonsterInitiativeBtn'); // New button
    const startInitiativeBtn = document.getElementById('startInitiativeBtn');
    const nextTurnBtn = document.getElementById('nextTurnBtn');
    const resetCombatBtn = document.getElementById('resetCombatBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');

    // Feature-locked elements
    const savePartyFileBtn = document.getElementById('savePartyFileBtn');
    const loadPartyFileBtn = document.getElementById('loadPartyFileBtn');
    const loadPartyFile = document.getElementById('loadPartyFile');
    const copyJsonTemplateBtn = document.getElementById('copyJsonTemplateBtn');
    const importJsonCombatantBtn = document.getElementById('importJsonCombatantBtn');
    const loadJsonCombatantFile = document.getElementById('loadJsonCombatantFile');
    const partyManagementSection = document.getElementById('partyManagementSection'); // New ID for the section to lock
    const jsonControlsSection = document.getElementById('jsonControlsSection'); // New ID for the section to lock


    let combatants = [];
    let currentRound = 1;
    let currentTurnIndex = -1; // -1 means no one's turn yet
    let allMonsters = []; // To store the full list of monsters from the API
    let allConditions = []; // To store the full list of conditions and their descriptions from the API
    let selectedMonsterData = null; // Store fetched monster data for display and adding

    const DND_API_BASE_URL = 'https://www.dnd5eapi.co/api';

    // --- Patreon Integration Variables and Constants ---
    // IMPORTANT: Replace 'YOUR_PATREON_CLIENT_ID' with your actual Client ID from Patreon Developer Portal.
    // This ID is publicly visible and safe to include in client-side code.
    const PATREON_CLIENT_ID = 'YOUR_PATREON_CLIENT_ID';
    // The redirect URI MUST EXACTLY match one configured in your Patreon Developer Client settings.
    // For local testing, use http://localhost:8000 (or your local server port).
    // For GitHub Pages, use your deployed URL, e.g., https://YOUR_USERNAME.github.io/YOUR_REPOSITORY_NAME/
    const PATREON_REDIRECT_URI = window.location.origin + window.location.pathname; // Dynamically sets to current page URL
    const PATREON_API_BASE_URL = 'https://www.patreon.com/api/oauth2/v2';
    const PATREON_OAUTH_AUTHORIZE_URL = 'https://www.patreon.com/oauth2/authorize';
    const PATREON_SCOPE = 'identity identity[email] pledges-to-me'; // Scopes needed for identity and pledges

    let patreonAccessToken = null;
    let isPaidPatreonMember = false;

    // Get references to Patreon UI elements
    const patreonLoginBtn = document.getElementById('patreonLoginBtn');
    const patreonStatusDiv = document.getElementById('patreonStatus');

    // --- Condition Icon Mapping ---
    const conditionIconMap = {
        'Blinded': 'eye-off',
        'Charmed': 'heart',
        'Deafened': 'ear-off',
        'Frightened': 'ghost',
        'Grappled': 'grip',
        'Incapacitated': 'hand',
        'Invisible': 'eye-off',
        'Paralyzed': 'zap',
        'Petrified': 'rocking-horse',
        'Poisoned': 'droplet',
        'Prone': 'person-standing',
        'Restrained': 'hand-metal',
        'Stunned': 'star',
        'Unconscious': 'moon',
        'Exhaustion': 'thermometer',
        'default': 'alert-circle' // Fallback icon
    };


    // --- Utility Functions ---

    /**
     * Opens a generic message modal.
     * @param {string} title - The title of the message.
     * @param {string} message - The message content.
     */
    function openMessageModal(title, message) {
        messageModalTitle.textContent = title;
        messageModalText.textContent = message;
        modalMessage.style.display = 'flex';
    }

    /**
     * Opens a generic confirmation modal.
     * @param {string} title - The title of the confirmation.
     * @param {string} message - The confirmation message.
     * @param {Function} onConfirm - Callback function if user confirms.
     * @param {Function} onCancel - Callback function if user cancels.
     */
    function openConfirmationModal(title, message, onConfirm, onCancel) {
        confirmationModalTitle.textContent = title;
        confirmationModalText.textContent = message;
        modalConfirmation.style.display = 'flex';

        const confirmHandler = () => {
            onConfirm();
            closeModal(modalConfirmation);
            confirmationModalConfirmBtn.removeEventListener('click', confirmHandler);
            confirmationModalCancelBtn.removeEventListener('click', cancelHandler);
        };

        const cancelHandler = () => {
            onCancel();
            closeModal(modalConfirmation);
            confirmationModalConfirmBtn.removeEventListener('click', confirmHandler);
            confirmationModalCancelBtn.removeEventListener('click', cancelHandler);
        };

        confirmationModalConfirmBtn.addEventListener('click', confirmHandler);
        confirmationModalCancelBtn.addEventListener('click', cancelHandler);
    }


    /**
     * Fetches all monster names and their slugs from the D&D 5e API.
     * Stores them in the `allMonsters` array for search suggestions.
     */
    async function fetchAllMonsters() {
        try {
            const response = await fetch(`${DND_API_BASE_URL}/monsters`);
            const data = await response.json();
            allMonsters = data.results.map(monster => ({
                name: monster.name,
                slug: monster.index
            }));
            console.log('Fetched all monster names:', allMonsters.length);
        } catch (error) {
            console.error('Error fetching monster list:', error);
            openMessageModal('Error', 'Error fetching monster list. Try again later.');
        }
    }

    /**
     * Fetches detailed information for a specific monster using its slug.
     * @param {string} slug - The index (slug) of the monster.
     * @returns {Object|null} The monster's detailed data or null if an error occurs.
     */
    async function fetchMonsterDetails(slug) {
        try {
            const response = await fetch(`${DND_API_BASE_URL}/monsters/${slug}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error(`Error fetching details for ${slug}:`, error);
            openMessageModal('Error', `Error fetching details for ${slug}.`);
            return null;
        }
    }

    /**
     * Fetches all conditions and their detailed descriptions from the D&D 5e API.
     * Stores them in the `allConditions` array.
     */
    async function fetchAllConditions() {
        try {
            const response = await fetch(`${DND_API_BASE_URL}/conditions`);
            const data = await response.json();
            allConditions = []; // Clear previous data
            for (const cond of data.results) {
                const detailResponse = await fetch(`${DND_API_BASE_URL}/conditions/${cond.index}`);
                const detailData = await detailResponse.json();
                allConditions.push({
                    name: detailData.name,
                    slug: detailData.index,
                    description: detailData.desc.join('\n\n') // Join array of strings into one with double newline
                });
            }
            console.log('Fetched all condition details:', allConditions.length);
            renderConditionsForSelection(); // Render conditions in the new modal after fetching
        } catch (error) {
            console.error('Error fetching conditions:', error);
            openMessageModal('Error', 'Error fetching conditions. Try again later.');
        }
    }

    /**
     * Generates a unique ID for combatants.
     * @returns {string} A unique ID.
     */
    function generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Adds a combatant to the global combatants array and re-renders the list.
     * Handles instance numbering for monsters.
     * @param {Object} combatantData - Data for the new combatant.
     */
    function addCombatant(combatantData) {
        // Handle multiple instances of the same monster name
        let instanceCount = 1;
        if (combatantData.isMonster) {
            const existingInstances = combatants.filter(c => c.name === combatantData.name && c.isMonster);
            if (existingInstances.length > 0) {
                instanceCount = Math.max(...existingInstances.map(c => c.instance || 0)) + 1;
            }
        }

        const newCombatant = {
            id: combatantData.id || generateUniqueId(), // Allow loading existing ID
            name: combatantData.name,
            maxHp: combatantData.maxHp,
            currentHp: combatantData.currentHp !== undefined ? combatantData.currentHp : combatantData.maxHp, // Retain current HP if loading
            tempHp: combatantData.tempHp !== undefined ? combatantData.tempHp : 0, // Retain temp HP if loading
            ac: combatantData.ac,
            initiative: combatantData.initiative !== undefined ? combatantData.initiative : null, // Retain initiative if loading
            initiativeBonus: combatantData.initiativeBonus || 0,
            isPC: combatantData.isPC || false,
            isMonster: combatantData.isMonster || false,
            conditions: combatantData.conditions || [], // Retain conditions if loading
            deathSaves: combatantData.isPC ? (combatantData.deathSaves || { successes: 0, failures: 0 }) : null,
            instance: instanceCount, // For unique numbering of monsters
            // Store full monster data if available (or custom data)
            monsterDetails: combatantData.monsterDetails || null,
            // Custom stats for imported JSON combatants
            stats: combatantData.stats || null,
            description: combatantData.description || '',
            features: combatantData.features || [],
            actions: combatantData.actions || []
        };
        combatants.push(newCombatant);
        renderCombatants();
        saveEncounter(); // Save the combatants whenever one is added
    }

    /**
     * Renders all combatants in the list, applying appropriate styling and event listeners.
     */
    function renderCombatants() {
        combatantList.innerHTML = ''; // Clear existing list
        if (combatants.length === 0) {
            combatantList.innerHTML = '<p style="text-align: center; color: var(--color-text-muted); padding: 20px;">No combatants yet. Add some!</p>';
            return;
        }

        combatants.forEach((combatant, index) => {
            const li = document.createElement('li');
            li.className = 'combatant-row';
            if (index === currentTurnIndex) {
                li.classList.add('current-turn');
            }
            // Only apply 'dead' class if HP is 0 or less AND it's a monster OR a PC with 3+ death save failures
            if (combatant.currentHp <= 0 && (!combatant.isPC || (combatant.deathSaves && combatant.deathSaves.failures >= 3))) {
                li.classList.add('dead');
            } else if (combatant.currentHp <= 0 && combatant.isPC && combatant.deathSaves && combatant.deathSaves.failures < 3) {
                li.classList.add('dying'); // For PCs who are down but not dead
            }

            li.dataset.id = combatant.id; // Unique ID for each combatant

            // Calculate HP status class
            let hpClass = '';
            if (combatant.currentHp <= 0) {
                if (combatant.isPC && combatant.deathSaves && combatant.deathSaves.successes < 3 && combatant.deathSaves.failures < 3) {
                    hpClass = 'dying'; // PC is dying but not dead yet
                } else {
                    hpClass = 'dead'; // Monster or PC with 3 failures
                }
            } else {
                const hpPercentage = (combatant.currentHp / combatant.maxHp) * 100;
                if (hpPercentage >= 75) {
                    hpClass = 'healthy';
                } else if (hpPercentage >= 50) {
                    hpClass = 'wounded';
                } else if (hpPercentage >= 25) {
                    hpClass = 'bloodied';
                } else {
                    hpClass = 'critical';
                }
            }

            // Determine if combatant name should be clickable for monster details
            const nameHtml = combatant.isMonster && (combatant.monsterDetails || combatant.stats) ?
                `<span class="combatant-name clickable-monster-name" data-id="${combatant.id}" title="View full monster details">${combatant.name}</span>` :
                `<span class="combatant-name">${combatant.name}</span>`;

            // Generate stat rolls for monsters
            let statRollsHtml = '';
            const statsToDisplay = combatant.monsterDetails ? {
                STR: combatant.monsterDetails.strength,
                DEX: combatant.monsterDetails.dexterity,
                CON: combatant.monsterDetails.constitution,
                INT: combatant.monsterDetails.intelligence,
                WIS: combatant.monsterDetails.wisdom,
                CHA: combatant.monsterDetails.charisma
            } : combatant.stats; // Use custom stats if available (from imported JSON)

            if (statsToDisplay) {
                statRollsHtml = '<div class="combatant-stats-rolls">';
                for (const statName in statsToDisplay) {
                    const statValue = statsToDisplay[statName];
                    if (statValue !== undefined && statValue !== null) {
                        const modifier = Math.floor((statValue - 10) / 2);
                        const modifierSign = modifier >= 0 ? '+' : '';
                        statRollsHtml += `
                            <span class="stat-item">
                                <strong>${statName}:</strong> ${statValue} (${modifierSign}${modifier})
                                <button class="stat-roll-button" data-id="${combatant.id}" data-stat="${statName}" data-modifier="${modifier}" title="Roll 1d20 for ${statName}"><i data-lucide="dice"></i></button>
                            </span>
                        `;
                    }
                }
                statRollsHtml += '</div>';
            }


            li.innerHTML = `
                <div class="combatant-info">
                    ${nameHtml}
                    <span class="instance-number" style="${combatant.instance > 1 ? '' : 'display:none;'}"> #${combatant.instance}</span>
                    <span class="combatant-ac" title="Armor Class">AC: <span class="ac-display">${combatant.ac}</span></span>
                    <span class="combatant-hp" title="Current Hit Points / Maximum Hit Points ${combatant.tempHp > 0 ? `(Includes Temporary HP)` : ''}">HP: <span class="hp-display ${hpClass}">${combatant.currentHp}</span> / ${combatant.maxHp} ${combatant.tempHp > 0 ? ` (<span class="temp-hp-display" title="Temporary Hit Points">${combatant.tempHp}</span> Temp)` : ''}</span>
                    <span class="combatant-initiative-score" title="Initiative Score">Init: <input type="number" class="initiative-input" value="${combatant.initiative !== null ? combatant.initiative : ''}" placeholder="Roll Init" data-id="${combatant.id}" title="Enter or roll initiative for this combatant"></span>
                    ${statRollsHtml}
                </div>
                <div class="combatant-hp-controls">
                    <div class="hp-control-titles">
                        <span class="hp-control-title">DMG</span>
                        <span class="hp-control-title">HP</span>
                        <span class="hp-control-title">TEMP</span>
                    </div>
                    <input type="number" class="hp-input" placeholder="Amount" data-id="${combatant.id}" title="Enter amount for HP actions">
                    <div class="hp-action-buttons-row">
                        <button class="hp-action-button damage" data-id="${combatant.id}" title="Apply damage"><i data-lucide="sword"></i></button>
                        <button class="hp-action-button heal" data-id="${combatant.id}" title="Apply healing"><i data-lucide="plus"></i></button>
                        <button class="hp-action-button temp" data-id="${combatant.id}" title="Apply temporary HP"><i data-lucide="shield"></i></button>
                    </div>
                </div>
                <div class="combatant-conditions">
                    <h4>Conditions</h4>
                    <div class="conditions-list-container"></div>
                </div>
                <div class="combatant-actions">
                    <h4>Actions</h4>
                    <button class="combatant-action-button roll-init-btn" data-id="${combatant.id}" data-init-bonus="${combatant.initiativeBonus}" title="Roll initiative for this combatant"><i data-lucide="dice"></i> Roll Init</button>
                    <button class="combatant-action-button add-condition-btn" data-id="${combatant.id}" title="Add a condition"><i data-lucide="thermometer"></i> Add Condition</button>
                    <button class="combatant-action-button kill" data-id="${combatant.id}" title="Set HP to 0 (Kill)"><i data-lucide="skull"></i> Kill</button>
                    <button class="combatant-action-button edit" data-id="${combatant.id}" title="Edit combatant details"><i data-lucide="edit"></i> Edit</button>
                    <button class="combatant-action-button remove" data-id="${combatant.id}" title="Remove combatant from list"><i data-lucide="x-circle"></i> Remove</button>
                </div>
                ${combatant.isPC && combatant.currentHp <= 0 ? `
                    <div class="death-saves">
                        <h4>Death Saves</h4>
                        <div class="death-save-row">
                            Successes:
                            <span class="death-save-box ${combatant.deathSaves && combatant.deathSaves.successes >= 1 ? 'success' : ''}" data-id="${combatant.id}" data-type="success" data-index="0" title="Death Save Success 1"></span>
                            <span class="death-save-box ${combatant.deathSaves && combatant.deathSaves.successes >= 2 ? 'success' : ''}" data-id="${combatant.id}" data-type="success" data-index="1" title="Death Save Success 2"></span>
                            <span class="death-save-box ${combatant.deathSaves && combatant.deathSaves.successes >= 3 ? 'success' : ''}" data-id="${combatant.id}" data-type="success" data-index="2" title="Death Save Success 3"></span>
                        </div>
                        <div class="death-save-row">
                            Failures:
                            <span class="death-save-box ${combatant.deathSaves && combatant.deathSaves.failures >= 1 ? 'failure' : ''}" data-id="${combatant.id}" data-type="failure" data-index="0" title="Death Save Failure 1"></span>
                            <span class="death-save-box ${combatant.deathSaves && combatant.deathSaves.failures >= 2 ? 'failure' : ''}" data-id="${combatant.id}" data-type="failure" data-index="1" title="Death Save Failure 2"></span>
                            <span class="death-save-box ${combatant.deathSaves && combatant.deathSaves.failures >= 3 ? 'failure' : ''}" data-id="${combatant.id}" data-type="failure" data-index="2" title="Death Save Failure 3"></span>
                        </div>
                    </div>
                ` : ''}
            `;
            combatantList.appendChild(li);

            // Re-create Lucide icons within the newly added li element
            lucide.createIcons({
                container: li
            });

            // Add event listeners for Initiative input (change event)
            li.querySelector('.initiative-input').addEventListener('change', (e) => {
                const id = e.target.dataset.id;
                const newInitiative = parseInt(e.target.value);
                const combatant = combatants.find(c => c.id === id);
                if (combatant && !isNaN(newInitiative)) {
                    combatant.initiative = newInitiative;
                }
                saveEncounter();
            });

            // Add event listener for clickable monster name
            const clickableName = li.querySelector('.clickable-monster-name');
            if (clickableName) {
                clickableName.addEventListener('click', () => showMonsterDetailsModal(combatant.id));
            }

            // Add event listeners for stat roll buttons
            li.querySelectorAll('.stat-roll-button').forEach(button => {
                button.addEventListener('click', (e) => {
                    const statName = e.currentTarget.dataset.stat;
                    const modifier = parseInt(e.currentTarget.dataset.modifier);
                    const roll = rollD20();
                    const total = roll + modifier;
                    rollDiceResult(`${statName} Roll: ${roll} ${modifier >= 0 ? '+' : ''}${modifier} = ${total}`);
                });
            });


            // Render conditions for each combatant
            const conditionsListContainer = li.querySelector('.conditions-list-container');
            combatant.conditions.forEach(condition => {
                const conditionIcon = document.createElement('div');
                conditionIcon.className = 'condition-icon';
                conditionIcon.dataset.conditionName = condition.name;
                conditionIcon.dataset.combatantId = combatant.id;

                // Set tooltip for condition description (first paragraph)
                const fullCondition = allConditions.find(c => c.name === condition.name);
                if (fullCondition && fullCondition.description) {
                    conditionIcon.title = `${fullCondition.name}: ${fullCondition.description.split('\n\n')[0]}`;
                } else {
                    conditionIcon.title = condition.name;
                }

                // Use Lucide icon if mapped, otherwise use first letter
                const iconName = conditionIconMap[condition.name] || conditionIconMap['default'];
                if (iconName) {
                    conditionIcon.innerHTML = `<i data-lucide="${iconName}"></i>`;
                } else {
                    conditionIcon.textContent = condition.name.charAt(0).toUpperCase();
                }

                // Add duration if present
                if (condition.duration !== null) {
                    const durationSpan = document.createElement('span');
                    durationSpan.className = 'duration';
                    durationSpan.textContent = condition.duration;
                    conditionIcon.appendChild(durationSpan);
                }

                // Add remove button ('x')
                const removeBtn = document.createElement('span');
                removeBtn.className = 'condition-remove-btn';
                removeBtn.innerHTML = '<i data-lucide="x"></i>'; // Use Lucide icon for remove
                removeBtn.dataset.combatantId = combatant.id;
                removeBtn.dataset.conditionName = condition.name;
                removeBtn.title = `Remove ${condition.name}`;
                conditionIcon.appendChild(removeBtn);

                conditionsListContainer.appendChild(conditionIcon);
            });
            // Re-create Lucide icons within the newly added condition icons
            lucide.createIcons({
                container: conditionsListContainer
            });
        });
        updateRoundTurnDisplay();
    }

    /**
     * Updates the displayed round and current turn information.
     */
    function updateRoundTurnDisplay() {
        currentRoundSpan.textContent = currentRound;
        if (currentTurnIndex !== -1 && combatants[currentTurnIndex]) {
            currentTurnSpan.textContent = combatants[currentTurnIndex].name + (combatants[currentTurnIndex].instance > 1 ? ` #${combatants[currentTurnIndex].instance}` : '');
        } else {
            currentTurnSpan.textContent = 'None';
        }
    }

    // --- Local Storage Management (for current encounter auto-save) ---

    /**
     * Saves the current combat state (combatants, round, turn index) to local storage.
     * This is for auto-saving the *current* encounter, not named parties.
     */
    function saveEncounter() {
        localStorage.setItem('currentCombatants', JSON.stringify(combatants));
        localStorage.setItem('currentRound', currentRound.toString());
        localStorage.setItem('currentTurnIndex', currentTurnIndex.toString());
    }

    /**
     * Loads the combat state from local storage.
     */
    function loadEncounter() {
        const savedCombatants = localStorage.getItem('currentCombatants');
        const savedRound = localStorage.getItem('currentRound');
        const savedTurnIndex = localStorage.getItem('currentTurnIndex');

        if (savedCombatants) {
            combatants = JSON.parse(savedCombatants);
            currentRound = parseInt(savedRound) || 1;
            currentTurnIndex = parseInt(savedTurnIndex) || -1;
            renderCombatants();
        }
    }

    /**
     * Saves the current list of combatants as a named party template to a JSON file.
     * @param {Array<Object>} partyCombatants - The array of combatants to save.
     */
    function savePartyToFile(partyCombatants) {
        openConfirmationModal(
            'Save Party',
            'Enter a filename for your party (e.g., MyAwesomeParty):',
            () => {
                const filename = prompt('Enter filename:'); // Using prompt for simplicity here, could be a modal input
                if (!filename || filename.trim() === '') {
                    openMessageModal('Error', 'Filename cannot be empty.');
                    return;
                }

                // Clean up combatants data before saving party (remove initiative, current HP, conditions etc.)
                const cleanedCombatants = partyCombatants.map(c => ({
                    name: c.name,
                    maxHp: c.maxHp,
                    ac: c.ac,
                    initiativeBonus: c.initiativeBonus,
                    isPC: c.isPC,
                    isMonster: c.isMonster,
                    // Only save essential monster details for re-fetching or custom display
                    monsterDetails: c.monsterDetails ? {
                        name: c.monsterDetails.name,
                        index: c.monsterDetails.index,
                        size: c.monsterDetails.size,
                        type: c.monsterDetails.type,
                        alignment: c.monsterDetails.alignment,
                        armor_class: c.monsterDetails.armor_class,
                        hit_points: c.monsterDetails.hit_points,
                        hit_points_roll: c.monsterDetails.hit_points_roll,
                        speed: c.monsterDetails.speed,
                        strength: c.monsterDetails.strength,
                        dexterity: c.monsterDetails.dexterity,
                        constitution: c.monsterDetails.constitution,
                        intelligence: c.monsterDetails.intelligence,
                        wisdom: c.wisdom,
                        charisma: c.charisma,
                        proficiencies: c.monsterDetails.proficiencies,
                        damage_vulnerabilities: c.monsterDetails.damage_vulnerabilities,
                        damage_resistances: c.monsterDetails.damage_resistances,
                        damage_immunities: c.monsterDetails.damage_immunities,
                        condition_immunities: c.monsterDetails.condition_immunities,
                        senses: c.monsterDetails.senses,
                        languages: c.monsterDetails.languages,
                        challenge_rating: c.monsterDetails.challenge_rating,
                        xp: c.monsterDetails.xp,
                        special_abilities: c.monsterDetails.special_abilities,
                        actions: c.monsterDetails.actions,
                        legendary_actions: c.monsterDetails.legendary_actions,
                        reactions: c.monsterDetails.reactions
                    } : null,
                    stats: c.stats || null, // Also save custom stats if present
                    description: c.description || '',
                    features: c.features || [],
                    actions: c.actions || []
                }));

                const dataStr = JSON.stringify(cleanedCombatants, null, 2);
                const blob = new Blob([dataStr], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${filename.trim().replace(/\s/g, '_')}.json`; // Sanitize filename
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
                openMessageModal('Success', `Current party saved to ${a.download}!`);
            },
            () => {
                // User cancelled
            }
        );
    }

    /**
     * Loads a party from a selected JSON file.
     * @param {File} file - The JSON file to load.
     */
    function loadPartyFromFile(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const loadedCombatants = JSON.parse(event.target.result);
                if (!Array.isArray(loadedCombatants)) {
                    openMessageModal('Error', 'Invalid file format. Please select a JSON file containing an array of combatants.');
                    return;
                }

                if (combatants.length > 0) {
                    openConfirmationModal(
                        'Load Party',
                        'Loading a new party will clear the current encounter. Continue?',
                        () => {
                            combatants = []; // Clear existing combatants
                            currentRound = 1;
                            currentTurnIndex = -1;

                            loadedCombatants.forEach(c => {
                                // Re-add with new unique IDs and fresh state
                                addCombatant({
                                    name: c.name,
                                    maxHp: c.maxHp,
                                    ac: c.ac,
                                    initiativeBonus: c.initiativeBonus,
                                    isPC: c.isPC,
                                    isMonster: c.isMonster,
                                    monsterDetails: c.monsterDetails || null, // Preserve monster details if present
                                    stats: c.stats || null, // Preserve custom stats if present
                                    description: c.description || '',
                                    features: c.features || [],
                                    actions: c.actions || []
                                });
                            });
                            renderCombatants();
                            saveEncounter(); // Save the newly loaded party as current encounter
                            openMessageModal('Success', 'Party loaded successfully!');
                        },
                        () => {
                            // User cancelled
                        }
                    );
                } else {
                    loadedCombatants.forEach(c => {
                        addCombatant({
                            name: c.name,
                            maxHp: c.maxHp,
                            ac: c.ac,
                            initiativeBonus: c.initiativeBonus,
                            isPC: c.isPC,
                            isMonster: c.isMonster,
                            monsterDetails: c.monsterDetails || null,
                            stats: c.stats || null,
                            description: c.description || '',
                            features: c.features || [],
                            actions: c.actions || []
                        });
                    });
                    renderCombatants();
                    saveEncounter();
                    openMessageModal('Success', 'Party loaded successfully!');
                }
            } catch (e) {
                openMessageModal('Error', 'Error parsing JSON file. Please ensure it is a valid JSON format.');
                console.error('Error loading party file:', e);
            }
        };
        reader.onerror = () => {
            openMessageModal('Error', 'Error reading file.');
        };
        reader.readAsText(file);
    }

    /**
     * Copies a JSON template for a custom combatant to the clipboard.
     */
    function copyJsonTemplate() {
        const prompt = `Build a monster using the JSON template below based on my description. Ask me to describe my creature briefly and what level party they are facing as well as what risk you want them to pose to help flesh it out, and then return only the completed JSON with no added fields that aren't currently present - no explanations or extra text. Provide the Json in a codeblock.

Once you have provided the JSON - Ask the player to return to the Initiative tracker to upload it and thank them for being a patreon/jimpeccable Supporter.\n\n`;

        const template = {
            "name": "Custom Combatant Name",
            "maxHp": 50,
            "ac": 15,
            "initiativeBonus": 2,
            "isPC": false,
            "isMonster": true,
            "description": "A brief description of your custom combatant.",
            "features": [
                {
                    "name": "Feature Name",
                    "description": "Description of the feature's effect."
                },
                {
                    "name": "Another Feature",
                    "description": "This combatant has another cool ability."
                }
            ],
            "actions": [
                {
                    "name": "Attack",
                    "description": "Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 1d8 + 3 slashing damage."
                }
            ],
            "stats": {
                "strength": 10,
                "dexterity": 14,
                "constitution": 12,
                "intelligence": 8,
                "wisdom": 10,
                "charisma": 10
            }
        };

        const jsonString = JSON.stringify(template, null, 2);

        const fullContent = prompt + "```json\n" + jsonString + "\n```";

        // Use execCommand for broader compatibility
        const textarea = document.createElement('textarea');
        textarea.value = fullContent;
        document.body.appendChild(textarea);
        textarea.select();

        try {
            const successful = document.execCommand('copy');
            const msg = successful ? 'AI prompt and JSON copied to clipboard!' : 'Failed to copy content.';
            openMessageModal('Copy JSON', msg);
        } catch (err) {
            console.error('Fallback: unable to copy', err);
            openMessageModal('Copy JSON', 'Failed to copy content. Please copy manually:\n\n' + fullContent);
        } finally {
            document.body.removeChild(textarea);
        }
    }


    /**
     * Imports a single combatant from a selected JSON file.
     * @param {File} file - The JSON file containing a single combatant object.
     */
    function importJsonCombatant(file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const combatantData = JSON.parse(event.target.result);
                // Basic validation for combatant structure
                if (!combatantData.name || !combatantData.maxHp || !combatantData.ac) {
                    openMessageModal('Error', 'Invalid combatant JSON. Missing required fields (name, maxHp, ac).');
                    return;
                }
                addCombatant(combatantData);
                openMessageModal('Success', `${combatantData.name} imported successfully!`);
            } catch (e) {
                openMessageModal('Error', 'Error parsing JSON file. Please ensure it is a valid JSON object.');
                console.error('Error importing combatant file:', e);
            }
        };
        reader.onerror = () => {
            openMessageModal('Error', 'Error reading file.');
        };
        reader.readAsText(file);
    }


    // --- Core Combat Logic Functions ---

    /**
     * Rolls a d20.
     * @returns {number} A random number between 1 and 20.
     */
    function rollD20() {
        return Math.floor(Math.random() * 20) + 1;
    }

    /**
     * Displays the result of a dice roll in the `rollResultDiv`.
     * @param {string} resultText - The text to display in the result area.
     */
    function rollDiceResult(resultText) {
        rollResultDiv.textContent = resultText;
    }

    /**
     * Parses and rolls dice notation (e.g., "2d6+3", "1d20-1").
     * Displays the result in the `rollResultDiv`.
     * @param {string} notation - The dice notation string.
     */
    function rollDice(notation) {
        notation = notation.toLowerCase().replace(/\s/g, ''); // Clean input

        const match = notation.match(/^(\d*)d(\d+)([\+\-]\d+)?$/);

        if (!match) {
            rollDiceResult('Invalid dice notation. Use format like 1d20, 2d6+3.');
            return;
        }

        const numDice = parseInt(match[1] || '1'); // Default to 1 die if number omitted (e.g., "d20")
        const dieSize = parseInt(match[2]);
        const modifier = match[3] ? parseInt(match[3]) : 0;

        if (numDice <= 0 || dieSize <= 0) {
            rollDiceResult('Number of dice and die size must be positive.');
            return;
        }
        if (numDice > 100) { // Prevent excessive rolls for performance/sanity
            rollDiceResult('Max 100 dice allowed for single roll.');
            return;
        }

        let total = 0;
        const rolls = [];

        for (let i = 0; i < numDice; i++) {
            const roll = Math.floor(Math.random() * dieSize) + 1;
            rolls.push(roll);
            total += roll;
        }

        let resultText = `Rolls: ${rolls.join(', ')}`;
        if (modifier !== 0) {
            resultText += ` Modifier: ${modifier > 0 ? '+' : ''}${modifier}`;
            total += modifier;
        }
        resultText += ` = Total: ${total}`;

        rollDiceResult(resultText);
    }

    /**
     * Sorts combatants by initiative (descending), then initiative bonus (descending), then name (ascending).
     * Resets the current turn after sorting.
     */
    function sortCombatants() {
        combatants.sort((a, b) => {
            // Primary sort by initiative (descending)
            if (b.initiative !== a.initiative) {
                return b.initiative - a.initiative;
            }
            // Secondary sort by initiative bonus (descending)
            if (b.initiativeBonus !== a.initiativeBonus) {
                return b.initiativeBonus - a.initiativeBonus;
            }
            // Tertiary sort by name (ascending)
            return a.name.localeCompare(b.name);
        });
        currentTurnIndex = -1; // Reset turn index after sorting
        renderCombatants();
        saveEncounter();
    }

    /**
     * Rolls initiative for all monsters that currently don't have an initiative score.
     */
    function rollAllMonsterInitiative() {
        let rolledCount = 0;
        combatants.forEach(combatant => {
            if (combatant.isMonster && (combatant.initiative === null || isNaN(combatant.initiative))) {
                const rollResult = rollD20();
                combatant.initiative = rollResult + combatant.initiativeBonus;
                rolledCount++;
            }
        });

        if (rolledCount > 0) {
            openMessageModal('Monster Initiative Rolled', `${rolledCount} monster(s) had their initiative rolled.`);
            sortCombatants(); // Re-sort after rolling
        } else {
            openMessageModal('No Monsters to Roll', 'All monsters already have an initiative score, or no monsters are present.');
        }
    }

    /**
     * Starts the initiative, sorting combatants and highlighting the first one.
     * Prompts if any combatant is missing initiative.
     */
    function startInitiative() {
        if (combatants.length === 0) {
            openMessageModal('Cannot Start Combat', 'Add combatants before starting initiative!');
            return;
        }

        const missingInitiative = combatants.some(c => c.initiative === null || isNaN(c.initiative));
        if (missingInitiative) {
            openMessageModal('Missing Initiative', 'Some combatants do not have an initiative score. Please roll or set initiative for all combatants before starting.');
            return;
        }

        sortCombatants(); // Ensure sorted
        currentRound = 1;
        currentTurnIndex = 0; // Start with the first combatant
        renderCombatants();
        saveEncounter();
        openMessageModal('Combat Started', 'First turn begins!');
    }

    /**
     * Advances the combat to the next turn. Handles round progression and condition durations.
     */
    function nextTurn() {
        if (combatants.length === 0) {
            openMessageModal('No Combatants', 'No combatants to advance turn for!');
            return;
        }

        // Decrement condition durations for the current combatant
        if (currentTurnIndex !== -1 && combatants[currentTurnIndex]) {
            const currentCombatant = combatants[currentTurnIndex];
            currentCombatant.conditions.forEach(condition => {
                if (condition.duration !== null && condition.duration > 0) {
                    condition.duration--;
                }
            });
            // Remove conditions that have expired
            currentCombatant.conditions = currentCombatant.conditions.filter(cond => cond.duration === null || cond.duration > 0);
        }

        // Filter out "dead" combatants for turn progression
        const activeCombatants = combatants.filter(c => !(c.currentHp <= 0 && (!c.isPC || (c.deathSaves && c.deathSaves.failures >= 3))));

        if (activeCombatants.length === 0) {
            openMessageModal('Combat Ended', 'All active combatants are down or combat ended!');
            currentTurnIndex = -1; // No active turn
            currentTurnSpan.textContent = 'None';
            currentRound = 1; // Reset round if combat ends
            saveEncounter();
            renderCombatants(); // Re-render to clear turn highlight
            return;
        }

        let nextIndexInActiveList = -1;
        if (currentTurnIndex === -1) {
            // Combat not started or just reset, start with the first active combatant
            nextIndexInActiveList = 0;
            currentRound = 1; // Ensure round is 1 when starting
        } else {
            // Find the current combatant's index in the *full* combatants list
            const currentCombatantInFullList = combatants[currentTurnIndex];
            const currentActiveIndex = activeCombatants.findIndex(c => c.id === currentCombatantInFullList.id);

            if (currentActiveIndex !== -1 && currentActiveIndex < activeCombatants.length - 1) {
                // Move to the next active combatant
                nextIndexInActiveList = currentActiveIndex + 1;
            } else {
                // Wrap around to the start of the active list, new round
                currentRound++;
                nextIndexInActiveList = 0;
            }
        }

        // Map the active list index back to the full combatants list index
        currentTurnIndex = combatants.findIndex(c => c.id === activeCombatants[nextIndexInActiveList].id);

        renderCombatants();
        saveEncounter();
    }

    /**
     * Resets the current combat encounter (round and turn), but keeps combatants.
     */
    function resetCombat() {
        openConfirmationModal(
            'Reset Combat',
            'Are you sure you want to reset the current round and turn? Combatants will remain.',
            () => {
                currentRound = 1;
                currentTurnIndex = -1;
                renderCombatants();
                saveEncounter();
                openMessageModal('Combat Reset', 'Combat round and turn have been reset.');
            },
            () => {
                // User cancelled
            }
        );
    }

    /**
     * Kills a combatant by setting their HP to 0 and applying dead status.
     * If already dead, it revives them to 1 HP and removes death saves.
     * @param {string} combatantId - The ID of the combatant to kill/revive.
     */
    function killCombatant(combatantId) {
        const combatant = combatants.find(c => c.id === combatantId);
        if (!combatant) return;

        if (combatant.currentHp <= 0 && (!combatant.isPC || (combatant.deathSaves && combatant.deathSaves.failures >= 3))) {
            // Combatant is currently dead, so revive them
            openConfirmationModal(
                'Revive Combatant',
                `Are you sure you want to revive ${combatant.name}? They will be set to 1 HP.`,
                () => {
                    combatant.currentHp = 1;
                    combatant.tempHp = 0; // Clear temp HP on revive
                    if (combatant.isPC) {
                        combatant.deathSaves = { successes: 0, failures: 0 }; // Reset death saves
                    }
                    renderCombatants();
                    saveEncounter();
                    openMessageModal('Combatant Revived', `${combatant.name} has been revived to 1 HP.`);
                },
                () => {
                    // User cancelled
                }
            );
        } else {
            // Combatant is alive (or dying), so kill them
            openConfirmationModal(
                'Kill Combatant',
                `Are you sure you want to kill ${combatant.name}? This will set their HP to 0.`,
                () => {
                    combatant.currentHp = 0;
                    combatant.tempHp = 0; // Clear temp HP on death
                    if (combatant.isPC) {
                        // For PCs, immediately mark as 3 failures if killed
                        combatant.deathSaves = { successes: 0, failures: 3 };
                    }
                    renderCombatants();
                    saveEncounter();
                    openMessageModal('Combatant Killed', `${combatant.name} has been set to 0 HP.`);
                },
                () => {
                    // User cancelled
                }
            );
        }
    }

    // --- HP and Death Save Functions ---

    /**
     * Applies damage to a combatant.
     * @param {string} combatantId - The ID of the combatant.
     * @param {number} amount - The amount of damage to apply.
     */
    function applyDamage(combatantId, amount) {
        const combatant = combatants.find(c => c.id === combatantId);
        if (combatant && amount > 0) {
            if (combatant.tempHp > 0) {
                if (amount <= combatant.tempHp) {
                    combatant.tempHp -= amount;
                } else {
                    combatant.currentHp -= (amount - combatant.tempHp);
                    combatant.tempHp = 0;
                }
            } else {
                combatant.currentHp -= amount;
            }
            // Reset death saves if HP goes above 0
            if (combatant.isPC && combatant.currentHp > 0 && combatant.deathSaves) {
                combatant.deathSaves.successes = 0;
                combatant.deathSaves.failures = 0;
            }
            renderCombatants();
            saveEncounter();
        }
    }

    /**
     * Applies healing to a combatant.
     * @param {string} combatantId - The ID of the combatant.
     * @param {number} amount - The amount of healing to apply.
     */
    function applyHealing(combatantId, amount) {
        const combatant = combatants.find(c => c.id === combatantId);
        if (combatant && amount > 0) {
            combatant.currentHp = Math.min(combatant.maxHp, combatant.currentHp + amount);
            // Reset death saves if HP goes above 0
            if (combatant.isPC && combatant.currentHp > 0 && combatant.deathSaves) {
                combatant.deathSaves.successes = 0;
                combatant.deathSaves.failures = 0;
            }
            renderCombatants();
            saveEncounter();
        }
    }

    /**
     * Applies temporary HP to a combatant.
     * @param {string} combatantId - The ID of the combatant.
     * @param {number} amount - The amount of temporary HP to apply.
     */
    function applyTempHp(combatantId, amount) {
        const combatant = combatants.find(c => c.id === combatantId);
        if (combatant && amount >= 0) { // Allow setting temp HP to 0
            // Temp HP doesn't stack, take the higher value, unless new value is 0
            combatant.tempHp = Math.max(combatant.tempHp, amount);
            if (amount === 0) combatant.tempHp = 0; // Explicitly set to 0 if input is 0
            renderCombatants();
            saveEncounter();
        }
    }

    /**
     * Toggles a death save success or failure for a PC.
     * @param {string} combatantId - The ID of the PC.
     * @param {'success'|'failure'} type - The type of death save.
     * @param {number} index - The index of the death save box (0, 1, or 2).
     */
    function toggleDeathSave(combatantId, type, index) {
        const combatant = combatants.find(c => c.id === combatantId);
        if (combatant && combatant.isPC && combatant.deathSaves) {
            if (type === 'success') {
                if (combatant.deathSaves.successes > index) { // Clicking filled to unfill
                    combatant.deathSaves.successes = index;
                } else { // Clicking empty to fill
                    combatant.deathSaves.successes = index + 1;
                }
            } else if (type === 'failure') {
                if (combatant.deathSaves.failures > index) { // Clicking filled to unfill
                    combatant.deathSaves.failures = index;
                } else { // Clicking empty to fill
                    combatant.deathSaves.failures = index + 1;
                }
            }
            // Logic for death/stabilization based on saves
            if (combatant.deathSaves.successes >= 3) {
                openMessageModal('Stable!', `${combatant.name} is stable! Death saves reset, HP set to 1.`);
                combatant.currentHp = 1; // Stabilize at 1 HP
                combatant.deathSaves = { successes: 0, failures: 0 }; // Reset saves
            } else if (combatant.deathSaves.failures >= 3) {
                openMessageModal('Dead!', `${combatant.name} is dead!`);
                combatant.currentHp = -999; // Mark as definitively dead
                combatant.deathSaves = { successes: 0, failures: 0 }; // Reset saves
            }

            renderCombatants();
            saveEncounter();
        }
    }

    // --- Condition Management Functions ---

    /**
     * Renders the list of conditions in the "Add Condition" modal,
     * filtered by search input. Allows multiple selection.
     * @param {string} filterText - Text to filter conditions by.
     */
    function renderConditionsForSelection(filterText = '') {
        conditionSelectionGrid.innerHTML = '';
        const filteredConditions = allConditions.filter(c =>
            c.name.toLowerCase().includes(filterText.toLowerCase())
        ).sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically

        if (filteredConditions.length === 0) {
            conditionSelectionGrid.innerHTML = '<p style="text-align: center; color: var(--color-text-muted); padding: 20px;">No conditions found.</p>';
            return;
        }

        filteredConditions.forEach(condition => {
            const conditionItem = document.createElement('div');
            conditionItem.className = 'condition-item';
            conditionItem.dataset.conditionName = condition.name;

            // Check if this condition is already selected for the current combatant
            const isAlreadyApplied = currentCombatantForCondition && currentCombatantForCondition.conditions.some(c => c.name === condition.name);
            if (isAlreadyApplied) {
                conditionItem.classList.add('applied'); // Indicate already applied
                conditionItem.title = `${condition.name} (Already Applied)`;
            }

            // Check if this condition is currently selected in the modal for application
            const isSelectedForAdd = selectedConditionsForAdd.some(c => c.name === condition.name);
            if (isSelectedForAdd) {
                conditionItem.classList.add('selected');
            }

            // Use Lucide icon if mapped, otherwise use first letter
            const iconName = conditionIconMap[condition.name] || conditionIconMap['default'];
            let iconHtml = '';
            if (iconName) {
                iconHtml = `<i data-lucide="${iconName}"></i>`;
            } else {
                iconHtml = `<span>${condition.name.charAt(0).toUpperCase()}</span>`;
            }

            conditionItem.innerHTML = `${iconHtml}<span>${condition.name}</span>`;

            conditionItem.addEventListener('click', () => {
                if (isAlreadyApplied) {
                    openMessageModal('Condition Already Applied', `${condition.name} is already applied to ${currentCombatantForCondition.name}.`);
                    return;
                }

                conditionItem.classList.toggle('selected');
                if (conditionItem.classList.contains('selected')) {
                    selectedConditionsForAdd.push(condition);
                } else {
                    selectedConditionsForAdd = selectedConditionsForAdd.filter(c => c.name !== condition.name);
                }
                applyConditionBtn.disabled = selectedConditionsForAdd.length === 0; // Enable/disable apply button
            });
            conditionSelectionGrid.appendChild(conditionItem);
            // Create Lucide icons for newly added condition items
            lucide.createIcons({
                container: conditionItem
            });
        });
    }

    /**
     * Opens the "Add Condition" modal for a specific combatant.
     * @param {string} combatantId - The ID of the combatant to add a condition to.
     */
    function openAddConditionModal(combatantId) {
        currentCombatantForCondition = combatants.find(c => c.id === combatantId);
        if (!currentCombatantForCondition) return;

        addConditionCombatantNameSpan.textContent = currentCombatantForCondition.name;
        addConditionSearchInput.value = ''; // Clear search input
        conditionDurationInput.value = ''; // Clear duration input
        selectedConditionsForAdd = []; // Reset selected conditions
        applyConditionBtn.disabled = true; // Disable apply button initially

        renderConditionsForSelection(); // Render all conditions
        openModal(modalAddCondition);
    }

    /**
     * Applies the selected conditions from the modal to the current combatant.
     */
    function applySelectedCondition() {
        if (!currentCombatantForCondition || selectedConditionsForAdd.length === 0) {
            openMessageModal('No Condition Selected', 'Please select at least one condition to apply.');
            return;
        }

        let duration = null;
        const durationValue = conditionDurationInput.value.trim();
        if (durationValue !== '') {
            duration = parseInt(durationValue);
            if (isNaN(duration) || duration < 0) {
                openMessageModal('Invalid Duration', 'Invalid duration. Please enter a non-negative number or leave empty for permanent.');
                duration = null; // Revert to permanent if invalid
            }
        }

        selectedConditionsForAdd.forEach(selectedCond => {
            // Check if combatant already has this condition
            if (!currentCombatantForCondition.conditions.some(c => c.name === selectedCond.name)) {
                currentCombatantForCondition.conditions.push({
                    name: selectedCond.name,
                    duration: duration,
                    description: selectedCond.description
                });
            }
        });

        renderCombatants();
        saveEncounter();
        closeModal(modalAddCondition);
        // Removed the message modal after applying conditions, as per user request.
    }

    /**
     * Removes a condition from a combatant.
     * @param {string} combatantId - The ID of the combatant.
     * @param {string} conditionName - The name of the condition to remove.
     */
    function removeCondition(combatantId, conditionName) {
        const combatant = combatants.find(c => c.id === combatantId);
        if (!combatant) return;

        openConfirmationModal(
            'Remove Condition',
            `Are you sure you want to remove the "${conditionName}" condition from ${combatant.name}?`,
            () => {
                combatant.conditions = combatant.conditions.filter(c => c.name !== conditionName);
                renderCombatants();
                saveEncounter();
                // Removed the message modal after removing conditions, as per user request.
            },
            () => {
                // User cancelled
            }
        );
    }

    /**
     * Displays the description of a condition in a modal.
     * @param {string} conditionName - The name of the condition.
     */
    function showConditionDescription(conditionName) {
        const condition = allConditions.find(c => c.name === conditionName);
        if (condition) {
            conditionDescriptionTitle.textContent = condition.name;
            conditionDescriptionText.innerHTML = `<p>${condition.description.replace(/\n/g, '</p><p>')}</p>`; // Preserve newlines as paragraphs
            openModal(modalConditionDescription);
        } else {
            openMessageModal('Error', 'Condition description not found.');
        }
    }


    // --- Modal Control Functions ---

    /**
     * Opens a given modal element. Resets inputs for specific modals.
     * @param {HTMLElement} modalElement - The modal DOM element to open.
     */
    function openModal(modalElement) {
        modalElement.style.display = 'flex'; // Use flex to center content
        // Reset inputs when opening PC or Monster modals
        if (modalElement.id === 'modal-pc-add') {
            pcNameModalInput.value = '';
            pcMaxHpModalInput.value = '';
            pcAcModalInput.value = '';
            pcInitiativeBonusModalInput.value = '0';
            pcNameModalInput.focus();
        } else if (modalElement.id === 'modal-monster-add') {
            monsterSearchInput.value = '';
            monsterSearchResults.innerHTML = '';
            monsterSearchResults.style.display = 'none';
            selectedMonsterData = null; // Clear selected monster data
            // Reset custom monster inputs
            monsterNameModalInput.value = '';
            monsterInitiativeModalInput.value = '';
            monsterHpModalInput.value = '';
            monsterAcModalInput.value = '';
            addMonsterModalBtn.disabled = true; // Disable until a monster is selected or custom data entered
            monsterSearchInput.focus();
            if (allMonsters.length === 0) {
                fetchAllMonsters(); // Fetch monsters if not already loaded
            }
        }
    }

    /**
     * Closes a given modal element. Resets `editingCombatantId` if closing the edit modal.
     * @param {HTMLElement} modalElement - The modal DOM element to close.
     */
    function closeModal(modalElement) {
        modalElement.style.display = 'none';
        if (modalElement.id === 'modal-edit-combatant') {
            editingCombatantId = null; // Clear the ID when the edit modal closes
        }
    }

    /**
     * Opens the "Edit Combatant" modal, populating it with the combatant's current data.
     * @param {string} combatantId - The ID of the combatant to edit.
     */
    function openEditCombatantModal(combatantId) {
        console.log('Attempting to open edit modal for combatantId:', combatantId);
        const combatant = combatants.find(c => c.id === combatantId);
        if (!combatant) {
            console.error('Combatant not found for ID:', combatantId);
            openMessageModal('Error', 'Combatant not found for editing.');
            return;
        }
        console.log('Found combatant:', combatant.name, combatant);

        editingCombatantId = combatantId; // Store the ID of the combatant being edited

        editNameModalInput.value = combatant.name;
        editInitiativeModalInput.value = combatant.initiative !== null ? combatant.initiative : '';
        editHpModalInput.value = combatant.currentHp;
        editMaxHpModalInput.value = combatant.maxHp;
        editAcModal.value = combatant.ac; // Corrected variable usage
        editTempHpModalInput.value = combatant.tempHp;

        openModal(modalEditCombatant);
        editNameModalInput.focus();
    }

    /**
     * Opens the full monster details modal for a given combatant.
     * @param {string} combatantId - The ID of the combatant (must be a monster).
     */
    function showMonsterDetailsModal(combatantId) {
        const combatant = combatants.find(c => c.id === combatantId);
        if (!combatant || !combatant.isMonster || (!combatant.monsterDetails && !combatant.stats)) {
            openMessageModal('No Details', 'No detailed monster data available for this combatant.');
            return;
        }

        const details = combatant.monsterDetails || combatant; // Use monsterDetails or the combatant itself for custom monsters
        monsterDetailsName.textContent = details.name;

        let contentHtml = `
            <h4>Basic Info</h4>
            <p><strong>Size:</strong> ${details.size || 'N/A'}</p>
            <p><strong>Type:</strong> ${details.type || 'N/A'}</p>
            <p><strong>Alignment:</strong> ${details.alignment || 'N/A'}</p>
            <p><strong>Armor Class:</strong> ${details.armor_class && details.armor_class.length > 0 ? details.armor_class[0].value : details.ac || 'N/A'}</p>
            <p><strong>Hit Points:</strong> ${details.hit_points || details.maxHp || 'N/A'} (${details.hit_points_roll || 'N/A'})</p>
            <p><strong>Speed:</strong> ${details.speed ? (typeof details.speed === 'object' ? Object.entries(details.speed).map(([key, value]) => `${key}: ${value}`).join(', ') : details.speed) : 'N/A'}</p>
        `;

        const stats = details.stats || {
            strength: details.strength,
            dexterity: details.dexterity,
            constitution: details.constitution,
            intelligence: details.intelligence,
            wisdom: details.wisdom,
            charisma: details.charisma
        };

        if (Object.values(stats).some(val => val !== undefined && val !== null)) {
            contentHtml += `<h4>Stats</h4>`;
            for (const statName in stats) {
                const statValue = stats[statName];
                if (statValue !== undefined && statValue !== null) {
                    const modifier = Math.floor((statValue - 10) / 2);
                    const modifierSign = modifier >= 0 ? '+' : '';
                    contentHtml += `<p><strong>${statName.toUpperCase()}:</strong> ${statValue} (${modifierSign}${modifier})</p>`;
                }
            }
        }


        if (details.proficiencies && details.proficiencies.length > 0) {
            contentHtml += `
                <h4>Proficiencies</h4>
                <ul>
                    ${details.proficiencies.map(p => `<li>${p.proficiency ? p.proficiency.name.replace('Saving Throw: ', '') : p.name} +${p.value}</li>`).join('')}
                </ul>
            `;
        }

        if (details.damage_vulnerabilities && details.damage_vulnerabilities.length > 0) {
            contentHtml += `<h4>Damage Vulnerabilities</h4><p>${details.damage_vulnerabilities.join(', ')}</p>`;
        }
        if (details.damage_resistances && details.damage_resistances.length > 0) {
            contentHtml += `<h4>Damage Resistances</h4><p>${details.damage_resistances.join(', ')}</p>`;
        }
        if (details.damage_immunities && details.damage_immunities.length > 0) {
            contentHtml += `<h4>Damage Immunities</h4><p>${details.damage_immunities.map(c => c.name || c).join(', ')}</p>`;
        }
        if (details.condition_immunities && details.condition_immunities.length > 0) {
            contentHtml += `<h4>Condition Immunities</h4><p>${details.condition_immunities.map(c => c.name || c).join(', ')}</p>`;
        }

        if (details.senses) {
            contentHtml += `<h4>Senses</h4><p>${Object.entries(details.senses).map(([key, value]) => `${key.replace(/_/g, ' ')}: ${value}`).join(', ')}</p>`;
        }
        if (details.languages) {
            contentHtml += `<h4>Languages</h4><p>${details.languages}</p>`;
        }
        if (details.challenge_rating) {
            contentHtml += `<h4>Challenge Rating</h4><p>${details.challenge_rating} (XP: ${details.xp || 'N/A'})</p>`;
        }

        // Custom description/features for imported JSON combatants
        if (details.description) {
            contentHtml += `<h4>Description</h4><p>${details.description}</p>`;
        }
        if (details.features && details.features.length > 0) {
            contentHtml += `
                <h4>Features</h4>
                ${details.features.map(f => `<p><strong>${f.name}:</strong> ${f.description}</p>`).join('')}
            `;
        }


        if (details.special_abilities && details.special_abilities.length > 0) {
            contentHtml += `
                <h4>Special Abilities</h4>
                ${details.special_abilities.map(sa => `<p><strong>${sa.name}:</strong> ${sa.desc}</p>`).join('')}
            `;
        }
        if (details.actions && details.actions.length > 0) {
            contentHtml += `
                <h4>Actions</h4>
                ${details.actions.map(action => `<p><strong>${action.name}:</strong> ${action.desc}</p>`).join('')}
            `;
        }
        if (details.legendary_actions && details.legendary_actions.length > 0) {
            contentHtml += `
                <h4>Legendary Actions</h4>
                <p>${details.legendary_desc || ''}</p>
                ${details.legendary_actions.map(la => `<p><strong>${la.name}:</strong> ${la.desc}</p>`).join('')}
            `;
        }
        if (details.reactions && details.reactions.length > 0) {
            contentHtml += `
                <h4>Reactions</h4>
                ${details.reactions.map(reaction => `<p><strong>${reaction.name}:</strong> ${reaction.desc}</p>`).join('')}
            `;
        }

        monsterDetailsContent.innerHTML = contentHtml;
        openModal(modalMonsterFullDetails);
    }

    // --- Patreon Integration Functions ---

    /**
     * Initiates the Patreon OAuth login flow by redirecting the user.
     */
    function loginWithPatreon() {
        // Construct the authorization URL
        const authUrl = `${PATREON_OAUTH_AUTHORIZE_URL}?` +
                       `response_type=token&` + // Request an access token directly (Implicit Grant)
                       `client_id=${PATREON_CLIENT_ID}&` +
                       `redirect_uri=${encodeURIComponent(PATREON_REDIRECT_URI)}&` +
                       `scope=${encodeURIComponent(PATREON_SCOPE)}`;
        window.location.href = authUrl; // Redirect the user
    }

    /**
     * Handles the callback from Patreon after user authorization.
     * Extracts the access token from the URL hash.
     */
    function handlePatreonCallback() {
        const hash = window.location.hash.substring(1); // Get hash fragment without '#'
        const params = new URLSearchParams(hash);
        const accessToken = params.get('access_token');

        if (accessToken) {
            patreonAccessToken = accessToken;
            // Store the access token for future sessions (with caution due to XSS risks)
            // For a production app, a backend for secure token storage and refresh is recommended.
            localStorage.setItem('patreonAccessToken', accessToken);
            console.log('Patreon Access Token obtained:', accessToken);
            // Clear hash from URL for cleaner appearance and to prevent re-processing on refresh
            window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
            fetchPatreonMembership(); // Immediately check membership
        } else {
            console.log('No Patreon access token found in URL hash.');
            // Try to load from local storage if not in URL (e.g., direct load after previous login)
            patreonAccessToken = localStorage.getItem('patreonAccessToken');
            if (patreonAccessToken) {
                console.log('Patreon Access Token loaded from local storage.');
                fetchPatreonMembership();
            } else {
                updateFeatureAccess(); // Ensure features are locked if no token
            }
        }
    }

    /**
     * Fetches the user's Patreon membership status using the access token.
     * Updates `isPaidPatreonMember` and then calls `updateFeatureAccess`.
     */
    async function fetchPatreonMembership() {
        if (!patreonAccessToken) {
            console.warn('No Patreon access token available to fetch membership.');
            isPaidPatreonMember = false;
            updateFeatureAccess();
            return;
        }

        try {
            // Fetch user identity and their memberships
            const response = await fetch(`${PATREON_API_BASE_URL}/identity?include=memberships.campaign&fields[member]=patron_status,currently_entitled_to_pledge_cents`, {
                headers: {
                    'Authorization': `Bearer ${patreonAccessToken}`
                }
            });

            if (!response.ok) {
                // If token is expired or invalid, clear it and log out
                if (response.status === 401) {
                    console.error('Patreon access token expired or invalid. Please log in again.');
                    localStorage.removeItem('patreonAccessToken');
                    patreonAccessToken = null;
                    openMessageModal('Patreon Error', 'Your Patreon session has expired. Please log in again.');
                } else {
                    console.error('Error fetching Patreon membership:', response.status, response.statusText);
                    openMessageModal('Patreon Error', `Failed to fetch Patreon data: ${response.statusText}`);
                }
                isPaidPatreonMember = false;
                updateFeatureAccess();
                return;
            }

            const data = await response.json();
            console.log('Patreon Identity Data:', data);

            // Check if the user has any active pledges to any campaign
            // For a specific campaign, you would check `data.included` for a `member` object
            // whose `relationships.campaign.data.id` matches your campaign ID,
            // and then check its `patron_status`.
            // For this example, we'll consider any active pledge as a paid member.
            isPaidPatreonMember = false;
            if (data.included) {
                const members = data.included.filter(item => item.type === 'member');
                for (const member of members) {
                    // Check if patron_status is 'active_patron' or 'will_pay_soon'
                    if (member.attributes.patron_status === 'active_patron' || member.attributes.patron_status === 'will_pay_soon') {
                        // Optionally, check `currently_entitled_to_pledge_cents` if you have tiers
                        // if (member.attributes.currently_entitled_to_pledge_cents > 0) {
                            isPaidPatreonMember = true;
                            break; // Found an active pledge, no need to check further
                        // }
                    }
                }
            }

            console.log('Is Paid Patreon Member:', isPaidPatreonMember);
            updateFeatureAccess();

        } catch (error) {
            console.error('Network error or unexpected response from Patreon API:', error);
            openMessageModal('Patreon Error', 'Could not connect to Patreon. Please check your internet connection.');
            isPaidPatreonMember = false;
            updateFeatureAccess();
        }
    }

    /**
     * Updates the visibility and enabled state of features based on Patreon membership.
     */
    function updateFeatureAccess() {
        if (isPaidPatreonMember) {
            patreonStatusDiv.textContent = 'Patreon Status: Logged in (Paid Member)';
            patreonLoginBtn.style.display = 'none'; // Hide login button
            partyManagementSection.classList.remove('patreon-locked-feature');
            jsonControlsSection.classList.remove('patreon-locked-feature');
            savePartyFileBtn.disabled = false;
            loadPartyFileBtn.disabled = false;
            copyJsonTemplateBtn.disabled = false;
            importJsonCombatantBtn.disabled = false;
        } else {
            patreonStatusDiv.textContent = 'Patreon Status: Not a paid member';
            patreonLoginBtn.style.display = 'block'; // Show login button
            partyManagementSection.classList.add('patreon-locked-feature');
            jsonControlsSection.classList.add('patreon-locked-feature');
            savePartyFileBtn.disabled = true;
            loadPartyFileBtn.disabled = true;
            copyJsonTemplateBtn.disabled = true;
            importJsonCombatantBtn.disabled = true;
        }
    }


    // --- Event Listeners ---

    // Open PC Modal Button
    openPcModalBtn.addEventListener('click', () => openModal(modalPcAdd));

    // Open Monster Modal Button
    openMonsterModalBtn.addEventListener('click', () => openModal(modalMonsterAdd));

    // Close Modal Buttons (the 'x' button)
    closeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const modalToClose = document.getElementById(e.target.closest('.close-button').dataset.modal);
            if (modalToClose) {
                closeModal(modalToClose);
            }
        });
    });

    // Close Generic Message Modal
    messageModalCloseBtn.addEventListener('click', () => closeModal(modalMessage));

    // Close Modal when clicking outside the modal content
    window.addEventListener('click', (event) => {
        if (event.target === modalPcAdd) {
            closeModal(modalPcAdd);
        } else if (event.target === modalMonsterAdd) {
            closeModal(modalMonsterAdd);
        } else if (event.target === modalEditCombatant) {
            closeModal(modalEditCombatant);
        } else if (event.target === modalConditionDescription) {
            closeModal(modalConditionDescription);
        } else if (event.target === modalAddCondition) {
            closeModal(modalAddCondition);
        } else if (event.target === modalClearConfirmation) {
            closeModal(modalClearConfirmation);
        } else if (event.target === modalMonsterFullDetails) {
            closeModal(modalMonsterFullDetails);
        } else if (event.target === modalMessage) {
            closeModal(modalMessage);
        } else if (event.target === modalConfirmation) {
            // Confirmation modal is handled by its internal buttons
        }
    });


    // Add PC Button (inside modal)
    addPcModalBtn.addEventListener('click', () => {
        const pcName = pcNameModalInput.value.trim();
        const pcMaxHp = parseInt(pcMaxHpModalInput.value);
        const pcAc = parseInt(pcAcModalInput.value);
        const pcInitiativeBonus = parseInt(pcInitiativeBonusModalInput.value);

        if (!pcName || isNaN(pcMaxHp) || pcMaxHp <= 0 || isNaN(pcAc) || isNaN(pcInitiativeBonus)) {
            openMessageModal('Input Error', 'Please fill in all PC fields correctly (Name, Max HP, AC, Initiative Bonus).');
            return;
        }

        addCombatant({
            name: pcName,
            maxHp: pcMaxHp,
            ac: pcAc,
            initiativeBonus: pcInitiativeBonus,
            isPC: true
        });

        closeModal(modalPcAdd); // Close modal after adding
        openMessageModal('PC Added', `${pcName} added to combat!`);
    });

    // Monster Search Input (inside modal) - Suggestions and Details Display
    monsterSearchInput.addEventListener('input', async (e) => {
        const query = e.target.value.toLowerCase();
        monsterSearchResults.innerHTML = '';
        selectedMonsterData = null; // Reset selected monster data
        addMonsterModalBtn.disabled = true; // Disable add button

        if (query.length < 2) {
            monsterSearchResults.style.display = 'none';
            // Enable add button if custom monster name is entered
            if (monsterNameModalInput.value.trim() !== '' && !isNaN(parseInt(monsterHpModalInput.value)) && !isNaN(parseInt(monsterAcModalInput.value))) {
                 addMonsterModalBtn.disabled = false;
             }
            return;
        }

        const filteredMonsters = allMonsters.filter(m =>
            m.name.toLowerCase().includes(query)
        ).slice(0, 10);

        if (filteredMonsters.length > 0) {
            monsterSearchResults.style.display = 'block';
            filteredMonsters.forEach(monster => {
                const div = document.createElement('div');
                div.textContent = monster.name;
                div.dataset.slug = monster.slug;
                div.classList.add('monster-suggestion-item'); // Add class for styling
                div.addEventListener('click', async () => {
                    monsterSearchInput.value = monster.name;
                    monsterSearchResults.style.display = 'none';
                    selectedMonsterData = await fetchMonsterDetails(monster.slug);
                    if (selectedMonsterData) {
                        // Populate modal fields with fetched data
                        monsterNameModalInput.value = selectedMonsterData.name;
                        monsterHpModalInput.value = selectedMonsterData.hit_points || '';
                        monsterAcModalInput.value = selectedMonsterData.armor_class && selectedMonsterData.armor_class.length > 0 ? selectedMonsterData.armor_class[0].value : '';
                        monsterInitiativeModalInput.value = selectedMonsterData.dexterity ? Math.floor((selectedMonsterData.dexterity - 10) / 2) : '0';
                        addMonsterModalBtn.disabled = false; // Enable add button
                    } else {
                        // If fetching fails, allow adding as custom if fields are filled
                        addMonsterModalBtn.disabled = !(monsterNameModalInput.value.trim() !== '' && !isNaN(parseInt(monsterHpModalInput.value)) && !isNaN(parseInt(monsterAcModalInput.value)));
                    }
                });
                monsterSearchResults.appendChild(div);
            });
        } else {
            monsterSearchResults.style.display = 'none';
            // If no suggestions, still allow adding as custom if fields are filled
            addMonsterModalBtn.disabled = !(monsterNameModalInput.value.trim() !== '' && !isNaN(parseInt(monsterHpModalInput.value)) && !isNaN(parseInt(monsterAcModalInput.value)));
        }
    });

    // Listen for changes in custom monster inputs to enable/disable add button
    [monsterNameModalInput, monsterHpModalInput, monsterAcModalInput, monsterInitiativeModalInput].forEach(input => {
        input.addEventListener('input', () => {
            // Enable add button if either a monster is selected OR custom fields are filled
            if (selectedMonsterData || (monsterNameModalInput.value.trim() !== '' && !isNaN(parseInt(monsterHpModalInput.value)) && !isNaN(parseInt(monsterAcModalInput.value)))) {
                addMonsterModalBtn.disabled = false;
            } else {
                addMonsterModalBtn.disabled = true;
            }
        });
    });


    // Add Monster Button (inside modal)
    addMonsterModalBtn.addEventListener('click', async () => {
        const customMonsterName = monsterNameModalInput.value.trim();
        const customMonsterHp = parseInt(monsterHpModalInput.value);
        const customMonsterAc = parseInt(monsterAcModalInput.value);
        const customMonsterInitiativeBonus = parseInt(monsterInitiativeModalInput.value);

        let monsterToAdd = {};

        if (selectedMonsterData) {
            // Use API data if a monster was selected from suggestions
            monsterToAdd = {
                name: selectedMonsterData.name,
                maxHp: selectedMonsterData.hit_points || 1, // Default to 1 if no HP from API
                ac: selectedMonsterData.armor_class && selectedMonsterData.armor_class.length > 0 ? selectedMonsterData.armor_class[0].value : 10, // Default AC
                initiativeBonus: selectedMonsterData.dexterity ? Math.floor((selectedMonsterData.dexterity - 10) / 2) : 0,
                isMonster: true,
                monsterDetails: selectedMonsterData // Store full details
            };
        } else if (customMonsterName && !isNaN(customMonsterHp) && customMonsterHp > 0 && !isNaN(customMonsterAc) && !isNaN(customMonsterInitiativeBonus)) {
            // Use custom input data if no monster was selected but custom fields are filled
            monsterToAdd = {
                name: customMonsterName,
                maxHp: customMonsterHp,
                ac: customMonsterAc,
                initiativeBonus: customMonsterInitiativeBonus,
                isMonster: true,
                monsterDetails: null, // No API details for custom
                stats: { // Populate basic stats for custom monster to make them rollable
                    strength: 10, // Default to 10, can be expanded for more custom fields
                    dexterity: (customMonsterInitiativeBonus * 2) + 10, // Estimate DEX from bonus
                    constitution: 10,
                    intelligence: 10,
                    wisdom: 10,
                    charisma: 10
                }
            };
        } else {
            openMessageModal('Input Error', 'Please select a monster from suggestions or fill in all custom monster fields correctly.');
            return;
        }

        addCombatant(monsterToAdd);
        closeModal(modalMonsterAdd);
        openMessageModal('Monster Added', `${monsterToAdd.name} added to combat!`);
    });

    // Save Current Party to File Button
    savePartyFileBtn.addEventListener('click', () => {
        if (!isPaidPatreonMember) {
            openMessageModal('Patreon Feature', 'This feature is available for paid Patreon members only. Please log in with Patreon.');
            return;
        }
        if (combatants.length === 0) {
            openMessageModal('No Combatants', 'There are no combatants to save in the current party.');
            return;
        }
        savePartyToFile(combatants);
    });

    // Load Party from File Button (triggers hidden file input)
    loadPartyFileBtn.addEventListener('click', () => {
        if (!isPaidPatreonMember) {
            openMessageModal('Patreon Feature', 'This feature is available for paid Patreon members only. Please log in with Patreon.');
            return;
        }
        loadPartyFile.click(); // Programmatically click the hidden file input
    });

    // Hidden file input change listener for loading party
    loadPartyFile.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            loadPartyFromFile(file);
        }
        event.target.value = ''; // Clear the input so same file can be selected again
    });

    // Copy JSON Template Button
    copyJsonTemplateBtn.addEventListener('click', () => {
        if (!isPaidPatreonMember) {
            openMessageModal('Patreon Feature', 'This feature is available for paid Patreon members only. Please log in with Patreon.');
            return;
        }
        copyJsonTemplate();
    });

    // Import JSON Combatant Button (triggers hidden file input)
    importJsonCombatantBtn.addEventListener('click', () => {
        if (!isPaidPatreonMember) {
            openMessageModal('Patreon Feature', 'This feature is available for paid Patreon members only. Please log in with Patreon.');
            return;
        }
        loadJsonCombatantFile.click();
    });

    // Hidden file input change listener for importing single combatant
    loadJsonCombatantFile.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            importJsonCombatant(file);
        }
        event.target.value = ''; // Clear the input
    });


    // Event Delegation for combatant-specific buttons (Roll Init, Damage, Heal, Conditions, Remove, Edit etc.)
    combatantList.addEventListener('click', (e) => {
        const target = e.target;
        // Use closest to find the button or icon's parent with the desired class
        const combatantItem = target.closest('.combatant-row');
        if (!combatantItem) return;
        const combatantId = combatantItem.dataset.id;
        const combatant = combatants.find(c => c.id === combatantId);
        if (!combatant) return;

        // Roll Init Button
        if (target.closest('.roll-init-btn')) {
            const initBonus = parseInt(target.closest('.roll-init-btn').dataset.initBonus);
            const rollResult = rollD20();
            combatant.initiative = rollResult + initBonus;
            const initiativeInput = combatantItem.querySelector('.initiative-input');
            if (initiativeInput) {
                initiativeInput.value = combatant.initiative;
            }
            saveEncounter();
            rollDiceResult(`Initiative Roll for ${combatant.name}: ${rollResult} + ${initBonus} = ${combatant.initiative}`);
        }
        // Damage Button
        else if (target.closest('.hp-action-button.damage')) {
            const amountInput = combatantItem.querySelector('.hp-input');
            const amount = parseInt(amountInput.value);
            if (!isNaN(amount) && amount > 0) {
                applyDamage(combatantId, amount);
                amountInput.value = '';
            } else {
                openMessageModal('Input Error', 'Please enter a valid positive number for damage.');
            }
        }
        // Heal Button
        else if (target.closest('.hp-action-button.heal')) {
            const amountInput = combatantItem.querySelector('.hp-input');
            const amount = parseInt(amountInput.value);
            if (!isNaN(amount) && amount > 0) {
                applyHealing(combatantId, amount);
                amountInput.value = '';
            } else {
                openMessageModal('Input Error', 'Please enter a valid positive number for healing.');
            }
        }
        // Temp HP Button
        else if (target.closest('.hp-action-button.temp')) {
            const amountInput = combatantItem.querySelector('.hp-input');
            const amount = parseInt(amountInput.value);
            if (!isNaN(amount) && amount >= 0) { // Can be 0 to remove
                applyTempHp(combatantId, amount);
                amountInput.value = '';
            } else {
                openMessageModal('Input Error', 'Please enter a valid non-negative number for temporary HP.');
            }
        }
        // Add Condition Button (opens new modal)
        else if (target.closest('.add-condition-btn')) {
            openAddConditionModal(combatantId);
        }
        // Kill Combatant Button
        else if (target.closest('.combatant-action-button.kill')) {
            killCombatant(combatantId);
        }
        // Edit Combatant Button
        else if (target.closest('.edit')) { // Using .edit class as a selector
            openEditCombatantModal(combatantId);
        }
        // Remove Condition 'x'
        else if (target.closest('.condition-remove-btn')) {
            const conditionName = target.closest('.condition-remove-btn').dataset.conditionName;
            removeCondition(combatantId, conditionName);
        }
        // Show Condition Description (click on the condition icon itself, but not the 'x')
        else if (target.closest('.condition-icon') && !target.closest('.condition-remove-btn')) {
            const conditionName = target.closest('.condition-icon').dataset.conditionName;
            showConditionDescription(conditionName);
        }
        // Remove Combatant Button
        else if (target.closest('.remove')) { // Using .remove class as a selector
            openConfirmationModal(
                'Remove Combatant',
                `Are you sure you want to remove ${combatant.name}?`,
                () => {
                    combatants = combatants.filter(c => c.id !== combatantId);
                    // Adjust currentTurnIndex if the removed combatant was before or at the current turn
                    if (currentTurnIndex !== -1) {
                        const removedIndex = Array.from(combatantList.children).findIndex(li => li.dataset.id === combatantId);
                        if (removedIndex !== -1) {
                            if (removedIndex === currentTurnIndex) {
                                currentTurnIndex = -1; // Reset if current turn is removed
                            } else if (removedIndex < currentTurnIndex) {
                                currentTurnIndex--;
                            }
                        }
                    }
                    renderCombatants();
                    saveEncounter();
                    openMessageModal('Combatant Removed', `${combatant.name} has been removed.`);
                },
                () => {
                    // User cancelled
                }
            );
        }
        // Death Save Boxes
        else if (target.classList.contains('death-save-box')) {
            const type = target.dataset.type;
            const index = parseInt(target.dataset.index);
            toggleDeathSave(combatantId, type, index);
        }
    });


    // Global Control Buttons
    sortInitiativeBtn.addEventListener('click', sortCombatants);
    rollMonsterInitiativeBtn.addEventListener('click', rollAllMonsterInitiative); // New listener
    startInitiativeBtn.addEventListener('click', startInitiative);
    nextTurnBtn.addEventListener('click', nextTurn);
    resetCombatBtn.addEventListener('click', resetCombat);
    clearAllBtn.addEventListener('click', () => openModal(modalClearConfirmation));

    // Dice Roller Button
    rollDiceBtn.addEventListener('click', () => {
        const notation = diceNotationInput.value.trim();
        if (notation) {
            rollDice(notation);
        } else {
            rollDiceResult('Please enter dice notation (e.g., 1d20+5).');
        }
    });

    // Common Dice Roll Buttons
    commonRollButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const diceNotation = e.target.dataset.roll; // Changed from data-dice to data-roll for consistency with HTML
            if (diceNotation) {
                diceNotationInput.value = diceNotation; // Populate input
                rollDice(diceNotation);
            }
        });
    });

    // Save Edit Combatant Button
    saveEditCombatantBtn.addEventListener('click', () => {
        if (!editingCombatantId) return; // Should not happen if modal opened correctly

        const combatant = combatants.find(c => c.id === editingCombatantId);
        if (!combatant) return;

        const newName = editNameModalInput.value.trim();
        const newInitiative = parseInt(editInitiativeModalInput.value);
        const newCurrentHp = parseInt(editHpModalInput.value);
        const newMaxHp = parseInt(editMaxHpModalInput.value);
        const newAc = parseInt(editAcModal.value); // Corrected variable usage
        const newTempHp = parseInt(editTempHpModalInput.value);


        if (!newName || isNaN(newCurrentHp) || isNaN(newMaxHp) || newMaxHp <= 0 || isNaN(newAc) || isNaN(newTempHp)) {
            openMessageModal('Input Error', 'Please fill in all fields correctly (Name, Current HP, Max HP, AC, Temp HP).');
            return;
        }

        // Update combatant properties
        combatant.name = newName;
        combatant.initiative = newInitiative;
        combatant.currentHp = newCurrentHp;
        combatant.maxHp = newMaxHp;
        combatant.ac = newAc;
        combatant.tempHp = newTempHp;

        // Reset death saves if HP goes above 0
        if (combatant.isPC && combatant.currentHp > 0 && combatant.deathSaves) {
            combatant.deathSaves.successes = 0;
            combatant.deathSaves.failures = 0;
        }

        renderCombatants();
        saveEncounter();
        closeModal(modalEditCombatant);
        openMessageModal('Changes Saved', `${combatant.name}'s details have been updated.`);
    });

    // Add Condition Modal Event Listeners
    addConditionSearchInput.addEventListener('input', (e) => {
        renderConditionsForSelection(e.target.value.trim());
    });

    applyConditionBtn.addEventListener('click', applySelectedCondition);

    // Clear Confirmation Modal Buttons
    clearAllCombatantsBtn.addEventListener('click', () => {
        openConfirmationModal(
            'Clear All Combatants',
            'This will remove ALL combatants and reset the encounter. Are you sure?',
            () => {
                combatants = [];
                currentRound = 1;
                currentTurnIndex = -1;
                renderCombatants();
                saveEncounter();
                closeModal(modalClearConfirmation);
                openMessageModal('Cleared', 'All combatants cleared!');
            },
            () => {
                // User cancelled
            }
        );
    });

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
                closeModal(modalClearConfirmation);
                openMessageModal('Monsters Cleared', 'Monsters cleared from combat!');
            },
            () => {
                // User cancelled
            }
        );
    });

    cancelClearBtn.addEventListener('click', () => {
        closeModal(modalClearConfirmation);
    });

    // Patreon Login Button
    patreonLoginBtn.addEventListener('click', loginWithPatreon);

    // Initial setup when DOM is ready
    loadEncounter();
    fetchAllMonsters();
    fetchAllConditions(); // Fetch all conditions on load
    handlePatreonCallback(); // Check for Patreon redirect on page load
    updateFeatureAccess(); // Set initial feature access based on Patreon status
});
