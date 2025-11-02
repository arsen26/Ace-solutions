<template>
  <v-container class="pa-4" max-width="700">
    <v-card elevation="2" class="pa-6">
      <v-card-title class="text-h5 mb-4 pa-0">
        <v-icon icon="mdi-lock-outline" class="mr-2"></v-icon>
        Gjeneratori i Fjalëkalimeve
      </v-card-title>

      <v-card-text class="pa-0">
        <!-- Password Display -->
        <v-text-field
          v-model="password"
          label="Password"
          variant="outlined"
          :append-inner-icon="show ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="show = !show"
          :type="show ? 'text' : 'password'"
          readonly
          class="mb-4 password-field"
          :class="strengthClass"
        >
          <template v-slot:prepend-inner>
            <v-icon :icon="strengthIcon" :color="strengthColor"></v-icon>
          </template>
        </v-text-field>

        <!-- Strength Indicator -->
        <div v-if="password" class="mb-4">
          <div class="d-flex justify-space-between align-center mb-2">
            <span class="text-body-2">Forca e Fjalëkalimit:</span>
            <v-chip :color="strengthColor" size="small" variant="flat">
              {{ strengthLabel }}
            </v-chip>
          </div>
          <v-progress-linear
            :model-value="progress"
            :color="strengthColor"
            height="8"
            rounded
          ></v-progress-linear>

          <!-- Feedback -->
          <v-alert
            v-if="feedback && (feedback.warning || feedback.suggestions?.length)"
            type="info"
            variant="tonal"
            density="compact"
            class="mt-3"
          >
            <div v-if="feedback.warning" class="text-body-2 mb-1">
              <strong>Vërejtje:</strong> {{ feedback.warning }}
            </div>
            <ul v-if="feedback.suggestions?.length" class="text-body-2 mb-0 pl-4">
              <li v-for="(s, i) in feedback.suggestions" :key="i">{{ s }}</li>
            </ul>
          </v-alert>
        </div>

        <v-divider class="my-4"></v-divider>

        <!-- Options -->
        <div class="mb-4">
          <v-row>
            <v-col cols="12" sm="6">
              <v-slider
                v-model="length"
                :min="8"
                :max="64"
                :step="1"
                thumb-label
                label="Gjatësia"
                color="primary"
              >
                <template v-slot:append>
                  <v-text-field
                    v-model.number="length"
                    type="number"
                    style="width: 70px"
                    density="compact"
                    variant="outlined"
                    hide-details
                    :min="8"
                    :max="64"
                  ></v-text-field>
                </template>
              </v-slider>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="d-flex flex-column gap-2">
                <v-checkbox
                  v-model="options.numbers"
                  label="Numra (0-9)"
                  density="compact"
                  hide-details
                ></v-checkbox>
                <v-checkbox
                  v-model="options.symbols"
                  label="Simbole (!@#$%)"
                  density="compact"
                  hide-details
                ></v-checkbox>
                <v-checkbox
                  v-model="options.uppercase"
                  label="Shkronja të Mëdha (A-Z)"
                  density="compact"
                  hide-details
                ></v-checkbox>
              </div>
            </v-col>
          </v-row>
        </div>

        <!-- Action Buttons -->
        <v-row>
          <v-col>
            <v-btn
              color="primary"
              @click="generate"
              prepend-icon="mdi-refresh"
              size="large"
              block
              class="mb-2"
            >
              Gjenero Password
            </v-btn>
          </v-col>
        </v-row>

        <v-row>
          <v-col cols="12" sm="6">
            <v-btn
              variant="outlined"
              @click="generatePassphrase"
              prepend-icon="mdi-text"
              block
            >
              Gjenero Passphrase
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6">
            <v-btn
              variant="outlined"
              color="success"
              @click="copyToClipboard"
              :disabled="!password"
              prepend-icon="mdi-content-copy"
              block
            >
              Kopjo
            </v-btn>
          </v-col>
        </v-row>

        <!-- Security Tips -->
        <v-expansion-panels class="mt-4">
          <v-expansion-panel>
            <v-expansion-panel-title>
              <v-icon icon="mdi-shield-check" class="mr-2"></v-icon>
              Këshilla për Siguri
            </v-expansion-panel-title>
            <v-expansion-panel-text>
              <ul class="text-body-2">
                <li>Përdorni fjalëkalime të gjata (minimum 12 karaktere)</li>
                <li>Kombinoni shkronja, numra dhe simbole</li>
                <li>Mos ripërdorni fjalëkalimin në账户 të ndryshëm</li>
                <li>Aktivizoni autentifikimin me dy faktorë kur është e mundur</li>
                <li>Përdorni një menaxher fjalëkalimesh për të ruajtur fjalëkalimet tuaj</li>
                <li>Ndërroni fjalëkalimet periodikisht, veçanërisht për账户 të rëndësishme</li>
              </ul>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-card-text>
    </v-card>

    <!-- Snackbar for copy notification -->
    <v-snackbar v-model="snackbar" :timeout="2000" color="success">
      <v-icon icon="mdi-check-circle" class="mr-2"></v-icon>
      Fjalëkalimi u kopjua në clipboard!
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import zxcvbn from 'zxcvbn'

// UI options
const password = ref('')
const show = ref(false)
const length = ref(16)
const options = ref({ numbers: true, symbols: true, uppercase: true })
const snackbar = ref(false)

// zxcvbn result
const score = ref(0)
const feedback = ref(null)

// Character sets for password generation
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz'
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const NUMBERS = '0123456789'
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?'

// Custom secure password generator using Web Crypto API
const generateSecurePassword = (len, opts) => {
  let charset = LOWERCASE
  const required = [LOWERCASE[0]] // Always include at least one lowercase

  if (opts.uppercase) {
    charset += UPPERCASE
    required.push(UPPERCASE[0])
  }
  if (opts.numbers) {
    charset += NUMBERS
    required.push(NUMBERS[0])
  }
  if (opts.symbols) {
    charset += SYMBOLS
    required.push(SYMBOLS[0])
  }

  // Generate random password
  const array = new Uint32Array(len)
  crypto.getRandomValues(array)

  let result = ''
  for (let i = 0; i < len; i++) {
    result += charset[array[i] % charset.length]
  }

  // Ensure at least one character from each required set
  // Replace first few characters with required ones
  const shuffleArray = new Uint32Array(required.length)
  crypto.getRandomValues(shuffleArray)

  for (let i = 0; i < required.length; i++) {
    const pos = shuffleArray[i] % len
    result = result.substring(0, pos) + required[i] + result.substring(pos + 1)
  }

  return result
}

// Enhanced password generation
const generate = () => {
  password.value = generateSecurePassword(length.value, options.value)
}

// Enhanced passphrase generation with larger wordlist
const generatePassphrase = () => {
  const wordlist = [
    'sun', 'river', 'mountain', 'coffee', 'digital', 'blue', 'stone', 'paper',
    'light', 'green', 'star', 'ocean', 'forest', 'thunder', 'silver', 'golden',
    'shadow', 'crystal', 'autumn', 'winter', 'spring', 'summer', 'phoenix',
    'dragon', 'eagle', 'wolf', 'tiger', 'dolphin', 'falcon', 'hawk',
    'maple', 'cedar', 'willow', 'birch', 'cherry', 'bamboo', 'lotus',
    'ruby', 'amber', 'jade', 'pearl', 'coral', 'ivory', 'marble',
    'canyon', 'valley', 'meadow', 'island', 'desert', 'glacier', 'volcano'
  ]

  const parts = []
  const numWords = Math.max(4, Math.floor(length.value / 6))

  // Use crypto.getRandomValues for better randomness
  const randomValues = new Uint32Array(numWords + 1)
  crypto.getRandomValues(randomValues)

  for (let i = 0; i < numWords; i++) {
    const randomIndex = randomValues[i] % wordlist.length
    parts.push(wordlist[randomIndex])
  }

  // Add a random number for extra entropy
  const randomNum = randomValues[numWords] % 1000
  password.value = parts.join('-') + '-' + randomNum
}

// Watch password changes and evaluate strength
watch(password, (val) => {
  if (!val) {
    score.value = 0
    feedback.value = null
    return
  }
  const r = zxcvbn(val)
  score.value = r.score
  feedback.value = r.feedback
})

// Computed properties for strength visualization
const strengthLabel = computed(() => {
  switch (score.value) {
    case 0: return 'Shumë i Dobët'
    case 1: return 'I Dobët'
    case 2: return 'Moderuar'
    case 3: return 'Mirë'
    case 4: return 'Shumë i Fortë'
    default: return '—'
  }
})

const strengthColor = computed(() => {
  switch (score.value) {
    case 0: return 'error'
    case 1: return 'warning'
    case 2: return 'info'
    case 3: return 'success'
    case 4: return 'green-darken-2'
    default: return 'grey'
  }
})

const strengthIcon = computed(() => {
  switch (score.value) {
    case 0: return 'mdi-shield-off'
    case 1: return 'mdi-shield-alert'
    case 2: return 'mdi-shield-half-full'
    case 3: return 'mdi-shield-check'
    case 4: return 'mdi-shield-star'
    default: return 'mdi-shield-outline'
  }
})

const strengthClass = computed(() => {
  return `strength-${score.value}`
})

const progress = computed(() => (score.value / 4) * 100)

// Enhanced clipboard copy with fallback
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(password.value)
    snackbar.value = true
  } catch (e) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = password.value
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    document.body.appendChild(textArea)
    textArea.select()
    try {
      document.execCommand('copy')
      snackbar.value = true
    } catch (err) {
      console.error('Failed to copy:', err)
      alert('Nuk u arrit të kopjohet në clipboard')
    }
    document.body.removeChild(textArea)
  }
}

// Generate initial password on mount
onMounted(() => {
  generate()
})
</script>

<style scoped>
.password-field {
  font-family: 'Courier New', monospace;
  font-size: 1.1em;
}

.password-field :deep(.v-field__input) {
  font-weight: 600;
  letter-spacing: 1px;
}

.gap-2 {
  gap: 8px;
}
</style>
