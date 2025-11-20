<template>
  <div class="text-center mt-10 pt-10 pb-10 container-style fluid">
    <v-row class="mt-10 mb-10 justify-center">
      <v-col cols="12">
        <h1 class="text-h3 font-weight-bold mb-2">Password Generator</h1>
        <p class="text-subtitle-1 text-grey-darken-1">
          Generate strong, secure passwords instantly
        </p>
      </v-col>
    </v-row>

    <v-row justify="center" class="mb-10">
      <v-col cols="12" md="10" lg="8">
        <v-card elevation="8" class="rounded-lg pa-6" color="#020c23">
          <v-row>
            <!-- Controls Section -->
            <v-col cols="12" md="6" class="d-flex flex-column justify-center">
              <div class="input-section">
                <!-- Length Slider -->
                <div class="mb-6">
                  <div class="d-flex justify-space-between mb-2">
                    <span class="text-grey-lighten-1">Password Length</span>
                    <span class="text-primary font-weight-bold">{{ length }}</span>
                  </div>
                  <v-slider
                    v-model="length"
                    :min="8"
                    :max="64"
                    :step="1"
                    color="primary"
                    hide-details
                    track-color="grey-darken-3"
                  ></v-slider>
                </div>

                <!-- Options -->
                <div class="options-grid mb-6">
                  <v-checkbox
                    v-model="options.uppercase"
                    label="Uppercase (A-Z)"
                    density="compact"
                    hide-details
                    color="primary"
                    class="text-grey-lighten-1"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="options.numbers"
                    label="Numbers (0-9)"
                    density="compact"
                    hide-details
                    color="primary"
                    class="text-grey-lighten-1"
                  ></v-checkbox>
                  <v-checkbox
                    v-model="options.symbols"
                    label="Symbols (!@#$)"
                    density="compact"
                    hide-details
                    color="primary"
                    class="text-grey-lighten-1"
                  ></v-checkbox>
                </div>

                <v-btn
                  class="generate-button-style mb-4"
                  size="large"
                  block
                  elevation="2"
                  @click="generate"
                >
                  <v-icon left class="mr-2">mdi-refresh</v-icon>
                  Generate Password
                </v-btn>

                <v-btn
                  variant="outlined"
                  class="passphrase-button-style"
                  size="large"
                  block
                  @click="generatePassphrase"
                >
                  <v-icon left class="mr-2">mdi-text</v-icon>
                  Generate Passphrase
                </v-btn>
              </div>
            </v-col>

            <v-divider vertical class="d-none d-md-flex" color="grey-darken-3"></v-divider>
            <v-divider class="d-flex d-md-none my-4" color="grey-darken-3"></v-divider>

            <!-- Result Section -->
            <v-col cols="12" md="6" class="d-flex align-center justify-center">
              <div class="w-100">
                <v-card class="result-card pa-4 mb-4" elevation="2">
                  <v-text-field
                    v-model="password"
                    variant="plain"
                    readonly
                    hide-details
                    class="password-display text-center text-h5"
                    :type="show ? 'text' : 'password'"
                  >
                    <template v-slot:append-inner>
                      <v-icon
                        :icon="show ? 'mdi-eye-off' : 'mdi-eye'"
                        @click="show = !show"
                        color="grey"
                        class="cursor-pointer"
                      ></v-icon>
                    </template>
                  </v-text-field>
                </v-card>

                <!-- Strength Meter -->
                <div v-if="password" class="mb-4">
                  <div class="d-flex justify-space-between align-center mb-2">
                    <span class="text-caption text-grey">Strength</span>
                    <v-chip :color="strengthColor" size="x-small" variant="flat">
                      {{ strengthLabel }}
                    </v-chip>
                  </div>
                  <v-progress-linear
                    :model-value="progress"
                    :color="strengthColor"
                    height="6"
                    rounded
                    bg-color="grey-darken-4"
                  ></v-progress-linear>
                </div>

                <v-btn
                  class="copy-button-style"
                  size="large"
                  block
                  @click="copyToClipboard"
                  :disabled="!password"
                >
                  <v-icon left class="mr-2">mdi-content-copy</v-icon>
                  Copy to Clipboard
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Security Tips -->
        <v-expansion-panels class="mt-6" variant="popout">
          <v-expansion-panel bg-color="#020c23" class="border-thin">
            <v-expansion-panel-title class="text-grey-lighten-1">
              <v-icon icon="mdi-shield-check" class="mr-2" color="primary"></v-icon>
              Security Tips
            </v-expansion-panel-title>
            <v-expansion-panel-text class="text-grey">
              <ul class="pl-4">
                <li class="mb-2">Use long passwords (minimum 12 characters)</li>
                <li class="mb-2">Combine uppercase, numbers, and symbols</li>
                <li class="mb-2">Don't reuse passwords across different accounts</li>
                <li class="mb-2">Enable Two-Factor Authentication (2FA) whenever possible</li>
                <li>Use a password manager to store your passwords securely</li>
              </ul>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>

    <v-snackbar v-model="snackbar" color="success" :timeout="2000" location="top">
      <v-icon icon="mdi-check-circle" class="mr-2"></v-icon>
      Copied to clipboard!
    </v-snackbar>
  </div>
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

// Enhanced passphrase generation
const generatePassphrase = () => {
  const wordlist = [
    'sun',
    'river',
    'mountain',
    'coffee',
    'digital',
    'blue',
    'stone',
    'paper',
    'light',
    'green',
    'star',
    'ocean',
    'forest',
    'thunder',
    'silver',
    'golden',
    'shadow',
    'crystal',
    'autumn',
    'winter',
    'spring',
    'summer',
    'phoenix',
    'dragon',
    'eagle',
    'wolf',
    'tiger',
    'dolphin',
    'falcon',
    'hawk',
    'maple',
    'cedar',
    'willow',
    'birch',
    'cherry',
    'bamboo',
    'lotus',
    'ruby',
    'amber',
    'jade',
    'pearl',
    'coral',
    'ivory',
    'marble',
    'canyon',
    'valley',
    'meadow',
    'island',
    'desert',
    'glacier',
    'volcano',
  ]

  const parts = []
  const numWords = Math.max(4, Math.floor(length.value / 6))

  const randomValues = new Uint32Array(numWords + 1)
  crypto.getRandomValues(randomValues)

  for (let i = 0; i < numWords; i++) {
    const randomIndex = randomValues[i] % wordlist.length
    parts.push(wordlist[randomIndex])
  }

  const randomNum = randomValues[numWords] % 1000
  password.value = parts.join('-') + '-' + randomNum
}

// Watch password changes and evaluate strength
watch(password, (val) => {
  if (!val) {
    score.value = 0
    return
  }
  const r = zxcvbn(val)
  score.value = r.score
})

// Computed properties for strength visualization
const strengthLabel = computed(() => {
  switch (score.value) {
    case 0:
      return 'Very Weak'
    case 1:
      return 'Weak'
    case 2:
      return 'Fair'
    case 3:
      return 'Good'
    case 4:
      return 'Strong'
    default:
      return '—'
  }
})

const strengthColor = computed(() => {
  switch (score.value) {
    case 0:
      return 'error'
    case 1:
      return 'warning'
    case 2:
      return 'info'
    case 3:
      return 'success'
    case 4:
      return 'green-accent-3'
    default:
      return 'grey'
  }
})

const progress = computed(() => (score.value / 4) * 100)

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(password.value)
    snackbar.value = true
  } catch (e) {
    // Fallback
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
    }
    document.body.removeChild(textArea)
  }
}

onMounted(() => {
  generate()
})
</script>

<style scoped>
.container-style {
  background-color: #010a1b;
  min-height: 100vh;
}

.input-section {
  width: 100%;
}

.generate-button-style {
  background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
  color: white;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.generate-button-style:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(25, 118, 210, 0.4);
}

.passphrase-button-style {
  color: #90caf9;
  border-color: #90caf9;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.passphrase-button-style:hover {
  background: rgba(144, 202, 249, 0.1);
  transform: translateY(-2px);
}

.copy-button-style {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  color: white;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
}

.copy-button-style:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.result-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.password-display :deep(.v-field__input) {
  font-family: 'Courier New', monospace;
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 1px;
}

.border-thin {
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 960px) {
  .text-h3 {
    font-size: 2rem !important;
  }
}
</style>
