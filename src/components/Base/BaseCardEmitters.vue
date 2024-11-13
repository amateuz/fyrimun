<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import BaseSvgIcon from '@/components/Base/BaseSvgIcon.vue'

interface CardPatterns {
  [key: string]: RegExp
}

const props = withDefaults(
  defineProps<{ cardNumber: string; isVisible?: boolean }>(),
  {
    isVisible: true
  }
)

const icons = ref([
  'visa',
  'mastercard',
  'amex',
  'diners',
  'discover',
  'jcb',
  'unionpay',
  'elo'
])

const detectedCardType = ref<string | null>(null)
const staticIconsNumber = 3
const cyclingIcons = ref(
  icons.value.slice(staticIconsNumber, icons.value.length - 1)
)
const currentCyclingIconIndex = ref(0)

const cycleIcons = () => {
  setInterval(() => {
    if (currentCyclingIconIndex.value < cyclingIcons.value.length - 1)
      currentCyclingIconIndex.value += 1
    else currentCyclingIconIndex.value = 0
  }, 3000)
}

const detectCardType = () => {
  const cardPatterns: CardPatterns = {
    visa: /^4[0-9]{0,}/,
    mastercard: /^5[1-5][0-9]{0,}/,
    amex: /^3[47][0-9]{0,}/,
    diners: /^3(?:0[0-5]|[68][0-9])[0-9]{0,}/,
    discover: /^6(?:011|5[0-9]{2})[0-9]{0,}/,
    jcb: /^(?:2131|1800|35[0-9]{3})[0-9]{0,}/,
    unionpay: /^(62|81)[0-9]{0,}/,
    elo: /^((506699|457631|401178|401179|431274|438935|457393|504175|627780|636297|636368)[0-9]{0,}|(509|6504|6505|6506|6507|6509|6516|6550)[0-9]{0,})/
  }

  for (const [cardType, pattern] of Object.entries(cardPatterns)) {
    if (pattern.test(props.cardNumber)) {
      detectedCardType.value = cardType
      return
    }
  }

  detectedCardType.value = null
}

watch(() => props.cardNumber, detectCardType)
onMounted(cycleIcons)
</script>

<template>
  <div class="card-emitters">
    <div
      :class="[
        'card-known-icon',
        { 'card-known-icon--hidden': detectedCardType === null || !isVisible }
      ]"
    >
      <BaseSvgIcon v-if="detectedCardType" :name="detectedCardType" />
    </div>
    <div
      :class="[
        'card-emitter-icons',
        { 'card-emitter-icons--slide': detectedCardType !== null || !isVisible }
      ]"
    >
      <div
        v-for="index in staticIconsNumber"
        :key="`icon-${icons[index]}`"
        class="card-emitter-icons__icon"
      >
        <BaseSvgIcon :name="icons[index - 1]" />
      </div>
      <div class="card-emitter-icons__cycling-container">
        <div
          v-for="(icon, index) in cyclingIcons"
          :key="`cycling-icon-${icon}`"
          :class="[
            'card-emitter-icons__cycling-icon',
            {
              'card-emitter-icons__cycling-icon--active':
                currentCyclingIconIndex === index
            }
          ]"
        >
          <BaseSvgIcon :name="icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-emitters {
  display: flex;
  justify-content: flex-end;
  border: 0.8px solid transparent;
  align-items: center;

  position: absolute;
  top: 0;
  right: 0;
  padding: 0.75rem;
  height: 100%;
}

.card-known-icon {
  display: flex;
  justify-content: flex-end;
  border: 0.8px solid transparent;
  align-items: center;

  position: absolute;
  top: 0;
  right: 0;
  padding: 0.75rem;
  height: 100%;
  width: 53px;
  opacity: 1;

  transition:
    opacity 0.6s cubic-bezier(0.19, 1, 0.22, 1),
    transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
  transition-delay: 0.1s;

  &--hidden {
    opacity: 0;
  }
}

.card-emitter-icons {
  $r: &;
  display: flex;
  justify-content: space-between;
  border: 0.8px solid transparent;
  align-items: center;
  transition:
    transform 0.6s ease,
    opacity 0.6s ease;
  transform-origin: right center;

  position: absolute;
  top: 0;
  right: 0;
  padding: 0.75rem;
  height: 100%;
  width: 152px;

  &--slide {
    opacity: 0;
    justify-content: flex-end;
    pointer-events: none;
    touch-action: none;

    #{$r}__icon {
      &:nth-child(1) {
        transform: translate(200%);
      }

      &:nth-child(2) {
        transform: translate(100%);
      }
    }
  }

  &__icon {
    flex: 1 1 100%;
    position: relative;
    opacity: 1;
    transition:
      opacity 0.7s cubic-bezier(0.19, 1, 0.22, 1),
      transform 0.7s cubic-bezier(0.19, 1, 0.22, 1);

    display: block;
    height: 100%;
    width: auto;

    &:not(&:last-child) {
      padding-right: 0.2em;
    }
  }

  &__cycling-icon {
    position: absolute;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;

    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    display: block;
    height: auto;
    width: auto;

    &--active {
      opacity: 1;
    }
  }

  &__cycling-container {
    position: relative;
    display: flex;
    flex: 1 1 100%;
    height: 100%;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 1.2s cubic-bezier(0.19, 1, 0.22, 1),
    transform 1.2s cubic-bezier(0.19, 1, 0.22, 1);
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
  transition:
    opacity 1.2s cubic-bezier(0.19, 1, 0.22, 1),
    transform 1.2s cubic-bezier(0.19, 1, 0.22, 1);
  transition-delay: 0.6s;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transition:
    opacity 1.2s cubic-bezier(0.19, 1, 0.22, 1),
    transform 1.2s cubic-bezier(0.19, 1, 0.22, 1);
}
</style>
