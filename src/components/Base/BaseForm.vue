<script lang="ts" setup>
import { computed, onBeforeMount, ref } from 'vue'
import * as yup from 'yup'
import type { Country } from '@/types'
import BaseSvgIcon from '@/components/Base/BaseSvgIcon.vue'
import countriesJson from '@/constants/countries.json'
import BaseCardEmitters from '@/components/Base/BaseCardEmitters.vue'

const countries = countriesJson as Country[]
const form = ref({
  cardNumber: '',
  expirationDate: '',
  securityCode: '',
  isBillingSameAsShipping: true,
  billingCountry: '',
  fullName: '',
  shippingCountry: '',
  addressLine1: '',
  email: ''
})

const currentMonth = new Date().getMonth() + 1
const currentYear = new Date().getFullYear() % 100
const validationSchema = yup.object().shape({
  cardNumber: yup
    .string()
    .matches(/^\d{4} \d{4} \d{4} \d{4}$/, 'Your card number is incomplete.')
    .required('Your card number is incomplete.'),
  expirationDate: yup
    .string()
    .matches(
      /^(0[1-9]|1[0-2])\s\/\s\d{2}$/,
      "Your card's expiration date is incomplete."
    )
    .test('is-future-date', 'Your expiration date is invalid.', (value) => {
      if (!value) return false
      const [month, year] = value.split('/').map(Number)
      return (
        year > currentYear || (year === currentYear && month >= currentMonth)
      )
    })
    .required("Your card's expiration date is incomplete."),
  securityCode: yup
    .string()
    .matches(/^\d{3}$/, "Your card's security code is incomplete.")
    .required("Your card's security code is incomplete."),
  billingCountry: yup.string().required('Country is required'),
  fullName: yup.string().required('Please provide your full name.'),
  shippingCountry: yup.string().required('Shipping country is required'),
  addressLine1: yup.string().required('This field is incomplete.'),
  email: yup
    .string()
    .email('Your email address is incomplete.')
    .required('Your email address is incomplete.')
})

const errors = ref<{ [key: string]: string }>({})

const validateFormField = async (field: string) => {
  try {
    await validationSchema.validateAt(field, form.value)
    delete errors.value[field]
  } catch (validationError) {
    if (validationError instanceof yup.ValidationError) {
      errors.value[field] = validationError.message
    }
  }
}

const validateForm = async () => {
  try {
    await validationSchema.validate(form.value, { abortEarly: false })
    alert('Form is valid! Proceeding with payment...')
  } catch (validationErrors) {
    errors.value = {}
    if (validationErrors instanceof yup.ValidationError) {
      validationErrors.inner.forEach((err) => {
        if (err.path) {
          errors.value[err.path] = err.message
        }
      })
    }
  }
}

const onSubmit = (event: Event) => {
  event.preventDefault()
  validateForm()
}

const fetchUserCountry = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    form.value.billingCountry = data.country
    form.value.shippingCountry = data.country
  } catch (error) {
    console.error('Error fetching geolocation data:', error)
  }
}

const formattedSecurityCode = computed({
  get() {
    return form.value.securityCode
  },
  set(value) {
    form.value.securityCode = value.replace(/\D/g, '').slice(0, 3)
  }
})

const validateNumericInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  target.value = target.value.replace(/\D/g, '')
}

const validateCardNumber = (event: Event) => {
  const target = event.target as HTMLInputElement
  const digitsOnly = target.value.replace(/\D/g, '').slice(0, 16)
  form.value.cardNumber = digitsOnly.replace(/(.{4})/g, '$1 ').trim()
}

const validateExpirationDate = (event: Event) => {
  const inputEvent = event as InputEvent
  const target = event.target as HTMLInputElement

  if (inputEvent.inputType === 'deleteContentBackward') {
    if (target.value.length === 4) {
      form.value.expirationDate = target.value.slice(0, 2)
    }
    return
  }

  const match = target.value.match(/^[0-9][1-9]{0,2}(?:\s\/\s\d{0,2})?/)
  let value = match ? match[0] : ''

  if (target.value.length === 3 && /^\d+$/.test(target.value)) {
    value = target.value.slice(0, 2) + ' / ' + target.value.slice(2, 3)
  }
  if (value.length === 1 && parseInt(value) > 1) {
    value = '0' + value
  }
  if (value.length >= 2) {
    const month = parseInt(value.slice(0, 2))
    if (month < 1 || month > 12) {
      value = '0' + value[1]
    }
  }
  if (value.length === 2) {
    value += ' / '
  }
  form.value.expirationDate = value.slice(0, 7)
}

const clearValidationError = (field: string) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
}

onBeforeMount(() => {
  fetchUserCountry()
})
</script>

<template>
  <form class="form" @submit="onSubmit">
    <div class="form__group">
      <label class="form__label" for="card-number">Card number</label>
      <div class="form__input-container">
        <input
          id="card-number"
          v-model="form.cardNumber"
          :class="[
            'form__input form__input--card-number',
            { 'form__input--error': errors.cardNumber }
          ]"
          maxlength="19"
          placeholder="1234 1234 1234 1234"
          type="text"
          @blur="validateFormField('cardNumber')"
          @input="
            (event) => {
              clearValidationError('cardNumber')
              validateCardNumber(event)
            }
          "
        />
        <Transition mode="out-in" name="fade">
          <div
            :key="
              errors.cardNumber
                ? 'icon-card-number-error'
                : 'icon-card-number-valid'
            "
            class="form__input-icon"
          >
            <BaseSvgIcon v-if="errors.cardNumber" name="card-error" />
            <BaseCardEmitters
              :card-number="form.cardNumber"
              :is-visible="!errors.hasOwnProperty('cardNumber')"
              class="form__card-emitters"
            />
          </div>
        </Transition>
      </div>
      <Transition name="slideInError">
        <span
          v-if="errors.cardNumber"
          key="error-card-number"
          class="form__error"
          >{{ errors.cardNumber }}</span
        >
      </Transition>
    </div>

    <div class="form__line">
      <div class="form__group">
        <label class="form__label">Expiration date</label>
        <input
          v-model="form.expirationDate"
          :class="[
            'form__input',
            { 'form__input--error': errors.expirationDate }
          ]"
          maxlength="7"
          placeholder="MM / YY"
          type="text"
          @blur="validateFormField('expirationDate')"
          @input="
            (event) => {
              clearValidationError('expirationDate')
              validateExpirationDate(event)
            }
          "
        />
        <Transition name="slideInError">
          <span
            v-if="errors.expirationDate"
            key="error-expiration-date"
            class="form__error"
            >{{ errors.expirationDate }}</span
          >
        </Transition>
      </div>

      <div class="form__group">
        <label class="form__label">Security code</label>
        <div class="form__input-container">
          <input
            v-model="formattedSecurityCode"
            :class="[
              'form__input form__input--security-code',
              { 'form__input--error': errors.securityCode }
            ]"
            maxlength="3"
            placeholder="CVC"
            type="text"
            @blur="validateFormField('securityCode')"
            @input="
              (event) => {
                clearValidationError('securityCode')
                validateNumericInput(event)
              }
            "
          />
          <Transition mode="out-in" name="fade">
            <div
              :key="
                errors.securityCode
                  ? 'icon-security-code-error'
                  : 'icon-security-code-valid'
              "
              class="form__input-icon"
            >
              <BaseSvgIcon
                :name="errors.securityCode ? 'card-cvc-error' : 'card-cvc'"
              />
            </div>
          </Transition>
        </div>
        <Transition name="slideInError">
          <span
            v-if="errors.securityCode"
            key="error-security-code"
            class="form__error"
            >{{ errors.securityCode }}</span
          >
        </Transition>
      </div>
    </div>

    <div class="form__group form__group--checkbox">
      <label class="form__checkbox-label">
        <span class="form__checkbox-container">
          <input
            v-model="form.isBillingSameAsShipping"
            class="form__checkbox"
            type="checkbox"
          />
          <span class="form__checkbox-box">
            <span class="form__checkmark"
              ><span
                class="form__checkmark-arm form__checkmark-arm--left"
              ></span
              ><span
                class="form__checkmark-arm form__checkmark-arm--right"
              ></span
            ></span>
          </span>
        </span>
        Billing is same as shipping information
      </label>
    </div>

    <Transition name="slideIn">
      <div v-if="!form.isBillingSameAsShipping" class="form__group">
        <label class="form__label">Country</label>
        <div class="form__select-container">
          <select
            v-model="form.billingCountry"
            :class="[
              'form__select',
              { 'form__select--error': errors.billingCountry }
            ]"
            @blur="clearValidationError('billingCountry')"
          >
            <option disabled value="">Select</option>
            <option
              v-for="country in countries"
              :key="country.code"
              :value="country.code"
            >
              {{ country.name }}
            </option>
          </select>
          <div class="form__select-icon-container">
            <BaseSvgIcon name="arrow-select" />
          </div>
        </div>
        <Transition name="slideInError">
          <span
            v-if="errors.billingCountry"
            key="error-billing-country"
            class="form__error"
            >{{ errors.billingCountry }}</span
          >
        </Transition>
      </div>
    </Transition>

    <div class="form__group">
      <label class="form__label">Full name</label>
      <input
        v-model="form.fullName"
        :class="['form__input', { 'form__input--error': errors.fullName }]"
        placeholder="First and last name"
        type="text"
        @blur="validateFormField('fullName')"
        @input="
          (event) => {
            clearValidationError('fullName')
            validateNumericInput(event)
          }
        "
      />
      <Transition name="slideInError">
        <span
          v-if="errors.fullName"
          key="error-full-name"
          class="form__error"
          >{{ errors.fullName }}</span
        >
      </Transition>
    </div>

    <div class="form__group">
      <label class="form__label">Country or region</label>
      <div class="form__select-container">
        <select
          v-model="form.shippingCountry"
          :class="[
            'form__select',
            { 'form__select--error': errors.shippingCountry }
          ]"
          @blur="clearValidationError('shippingCountry')"
        >
          <option disabled value="">Select</option>
          <option
            v-for="country in countries"
            :key="country.code"
            :value="country.code"
          >
            {{ country.name }}
          </option>
        </select>
        <div class="form__select-icon-container">
          <BaseSvgIcon name="arrow-select" />
        </div>
      </div>
      <Transition name="slideInError">
        <span
          v-if="errors.shippingCountry"
          key="error-shipping-country"
          class="form__error"
          >{{ errors.shippingCountry }}</span
        >
      </Transition>
    </div>

    <div class="form__group">
      <label class="form__label">Address line 1</label>
      <input
        v-model="form.addressLine1"
        :class="['form__input', { 'form__input--error': errors.addressLine1 }]"
        placeholder="Street address"
        type="text"
        @blur="validateFormField('addressLine1')"
        @input="clearValidationError('addressLine1')"
      />
      <Transition name="slideInError">
        <span
          v-if="errors.addressLine1"
          key="error-address-line"
          class="form__error"
          >{{ errors.addressLine1 }}</span
        >
      </Transition>
    </div>

    <div class="form__group">
      <label class="form__label">Email</label>
      <input
        v-model="form.email"
        :class="['form__input', { 'form__input--error': errors.email }]"
        placeholder="you@example.com"
        type="email"
        @blur="validateFormField('email')"
        @input="clearValidationError('email')"
      />
      <Transition name="slideInError">
        <span v-if="errors.email" key="error-email" class="form__error">{{
          errors.email
        }}</span>
      </Transition>
    </div>

    <button class="form__button" type="submit">Pay now</button>
  </form>
</template>

<style lang="scss" scoped>
@mixin focus-style {
  border-color: $color-blue-10;
  outline: 0;

  box-shadow:
    0 1px 1px rgb(0 0 0 / 3%),
    0 3px 6px rgb(0 0 0 / 2%),
    0 0 0 3px hsl(210deg 96% 45% / 25%),
    0 1px 1px 0 rgb(0 0 0 / 8%);
}

.form {
  display: flex;
  flex-direction: column;
  width: 100%;

  &__line {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.75rem;

    .form__group {
      flex: 1 1 100%;
    }
  }

  &__group {
    flex-grow: 1;

    margin-bottom: 0.75rem;

    &--checkbox {
      margin-top: 0.75rem;
    }
  }

  &__input-container {
    position: relative;
  }

  &__input-icon {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0.75rem;
    border: 0.8px solid transparent;

    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    touch-action: none;

    .svg-icon {
      width: 1.95em;
      height: 1.95em;
      max-height: unset;
    }
  }

  &__label,
  &__checkbox-label {
    display: block;
    margin-bottom: 0.25rem;

    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 0.93rem;
    line-height: 1.15;

    color: $color-grey-17;

    transition:
      transform 0.5s cubic-bezier(0.19, 1, 0.22, 1),
      opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1);
    touch-action: manipulation;
  }

  &__checkbox-label {
    user-select: none;
  }

  &__input,
  &__select,
  &__checkbox-box {
    padding: 0.75rem;
    width: 100%;
    border: 1px solid $color-grey--12;
    border-radius: 5px;

    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 1rem;
    line-height: 1.35rem;

    background-color: $color-white;
    box-shadow:
      0 1px 1px rgb(0 0 0 / 3%),
      0 3px 6px rgb(0 0 0 / 2%);
    color: $color-grey-17;

    transition:
      background 0.15s ease,
      border 0.15s ease,
      box-shadow 0.15s ease,
      color 0.15s ease;
    animation: native-autofill-out 1ms ease;
    touch-action: manipulation;
    appearance: none;
    outline-offset: 0;
    outline-width: 2px;
  }

  &__input,
  &__select {
    &:focus {
      @include focus-style;
    }

    &--error {
      border-color: $color-red--3;
      outline: 1px solid $color-red--3;

      color: $color-red--3;

      &::placeholder {
        color: #757680;
      }
    }
  }

  &__select {
    padding-right: 1.75rem;

    color: $color-grey-17;
    cursor: pointer;

    option {
      &,
      &[disabled]:not([disabled='false']) {
        color: $color-grey-17;
      }
    }
  }

  &__select-container {
    position: relative;
  }

  &__select-icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0.75rem;
    height: 100%;
    border: 0.8px solid transparent;

    position: absolute;
    top: 0;
    right: 0;
    z-index: $z-interactive;

    font-size: 1rem;

    color: $color-grey-17;
    pointer-events: none;
    touch-action: none;

    .svg-icon {
      width: 0.8em;
      height: 0.8em;
      fill: $color-grey-17;
    }
  }

  &__checkbox {
    padding: 0;
    width: 100%;
    height: 100%;

    position: absolute;
    top: 0;
    left: 0;

    cursor: pointer;
    opacity: 0;
  }

  &__checkbox-box {
    display: block;
    padding: 0;
    height: 100%;

    position: relative;

    cursor: pointer;
  }

  &__checkbox:checked ~ &__checkbox-box {
    border: none;

    background-color: $color-blue-10;

    .form__checkmark-arm {
      transform: scale(1);
    }
  }

  &__checkbox-label {
    display: flex;
    align-items: center;

    cursor: pointer;
  }

  &__checkbox-container {
    display: block;
    margin-right: 0.5rem;
    width: 1.3em;
    height: 1.3em;
    box-sizing: content-box;

    position: relative;

    cursor: pointer;
    flex-shrink: 0;

    &:focus-within {
      .form__checkbox-box {
        @include focus-style;
      }
    }
  }

  &__checkmark {
    width: 64%;
    height: 32%;

    position: absolute;
    top: 0;
    left: 0;
    transform: rotate(-45deg) translate(-10%, 100%);

    font-size: 0.93rem;
    line-height: 1.15;

    opacity: 1;

    transition: opacity 0s ease;
  }

  &__checkmark-arm {
    display: block;

    position: absolute;
    left: 0;
    transform: scale(0);

    font-size: 0.93rem;
    line-height: 1.15;

    background-color: $color-white;

    content: '';
    will-change: transform;

    &--left {
      width: max(2px, 0.15em);

      top: 0;
      bottom: 1px;

      transition: transform 0.1s ease 0.08s;
      transform-origin: 0 0;
    }

    &--right {
      height: max(2px, 0.15em);

      right: 0;
      bottom: 0;

      transition: transform 0.1s ease 0.16s;
      transform-origin: 0 100%;
    }
  }

  &__error {
    display: block;
    margin-top: 0.25rem;
    max-height: 37px;

    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-size: 0.93rem;
    line-height: 1.15em;

    color: $color-red--3;
  }

  &__button {
    @include font-family(Inter);
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 0.6875rem;
    padding-bottom: 0.6875rem;
    width: 100%;
    height: 3rem;
    border: none;
    border-radius: 100px;

    font-size: 1.125rem;
    font-weight: 500;
    line-height: 1.625rem;
    text-align: center;

    background-color: $color-blue;
    color: $color-white;
    cursor: pointer;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.35s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slideInError-enter-active,
.slideInError-leave-active {
  transition:
    max-height 0.35s ease,
    opacity 0.25s ease;
}

.slideInError-enter-from,
.slideInError-leave-to {
  max-height: 0;

  opacity: 0;
}

.slideInError-enter-to,
.slideInError-leave-from {
  max-height: 37px;

  opacity: 1;
}

.slideIn-enter-active,
.slideIn-leave-active {
  overflow: hidden;

  transition:
    max-height 0.35s ease,
    margin 0.35s ease,
    opacity 0.4s 0.1s ease;
}

.slideIn-enter-from,
.slideIn-leave-to {
  margin-bottom: 0;
  max-height: 0;
  overflow: hidden;
}

.slideIn-enter-to,
.slideIn-leave-from {
  margin-bottom: 0.75rem;
  max-height: 69px;
}
</style>
