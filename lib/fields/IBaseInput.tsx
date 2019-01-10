import { BaseField } from './BaseField';

export interface BaseInputProps<F extends BaseField, V> {
  disabled?: boolean
  field: F
  errors?: any[]
  onBlur: () => void
  onChange: (value?: V) => void
  value?: V
}
