import {
  IonItem,
  IonLabel,
  IonInput,
  IonNote,
  InputChangeEventDetail,
} from '@ionic/react';
import type { TextFieldTypes } from '@ionic/core'; // ← IMPORTANTE

type Props = {
  label: string;
  value?: string;
  placeholder?: string;
  type?: TextFieldTypes;                 // ← usa el tipo correcto
  disabled?: boolean;
  error?: string;
  onIonChange?: (e: CustomEvent<InputChangeEventDetail>) => void;
  inputmode?: 'none' | 'text' | 'tel' | 'url' | 'email' | 'numeric' | 'decimal' | 'search';
};

export default function FormField({
  label,
  value,
  placeholder,
  type,
  disabled,
  error,
  onIonChange,
  inputmode,
}: Props) {
  // default seguro para IonInput
  const inputType: TextFieldTypes = type ?? 'text';

  return (
    <>
      <IonItem className={`bn-input-item ${error ? 'error' : ''}`} lines="none">
        <IonLabel position="stacked">{label}</IonLabel>

        <IonInput
          className={`bn-input ${disabled ? 'bn-input--disabled' : ''}`}
          type={inputType}             // ← ya no marca error
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onIonChange={onIonChange}
          inputmode={inputmode}        // ← prop en minúsculas
        />
      </IonItem>

      {error && <IonNote className="bn-input-error">{error}</IonNote>}
    </>
  );
}
