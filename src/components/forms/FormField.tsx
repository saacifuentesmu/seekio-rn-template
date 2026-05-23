import React from 'react';
import {Controller, FieldValues, Path, useFormContext} from 'react-hook-form';

import {TextInput} from '@/components/UI/TextInput';

interface Props<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export function FormField<T extends FieldValues>(props: Props<T>) {
  const {
    control,
    formState: {errors},
  } = useFormContext<T>();
  const errorMessage = (
    errors as Record<string, {message?: string} | undefined>
  )[props.name]?.message;
  return (
    <Controller
      control={control}
      name={props.name}
      render={({field: {onChange, onBlur, value}}) => (
        <TextInput
          label={props.label}
          placeholder={props.placeholder}
          value={value as string}
          onChangeText={onChange}
          onBlur={onBlur}
          secureTextEntry={props.secureTextEntry}
          keyboardType={props.keyboardType}
          autoCapitalize={props.autoCapitalize}
          error={errorMessage}
        />
      )}
    />
  );
}
