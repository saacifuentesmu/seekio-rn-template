import {yupResolver} from '@hookform/resolvers/yup';
import React from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {ScrollView, StyleSheet, Text} from 'react-native';
import * as yup from 'yup';

import {Button} from '@/components/UI/Button';
import {FormField} from '@/components/forms/FormField';
import {useLogin} from '@/hooks/auth/useLogin';
import {useTheme} from '@/theme/ThemeProvider';
import {toErrorMessage} from '@/utils/errors';

interface LoginForm {
  email: string;
  password: string;
}

export const LoginScreen: React.FC = () => {
  const {t} = useTranslation();
  const {palette, spacing, typography} = useTheme();
  const login = useLogin();

  const schema = yup.object({
    email: yup.string().required(t('auth.emailRequired')).email(t('auth.emailInvalid')),
    password: yup.string().required(t('auth.passwordRequired')),
  });

  const methods = useForm<LoginForm>({
    resolver: yupResolver(schema),
    defaultValues: {email: '', password: ''},
  });

  const onSubmit = methods.handleSubmit(data => login.mutate(data));

  return (
    <ScrollView contentContainerStyle={[styles.container, {padding: spacing.lg, backgroundColor: palette.background}]}>
      <Text style={[typography.h1, {color: palette.text, marginBottom: spacing.lg}]}>{t('appName')}</Text>
      <FormProvider {...methods}>
        <FormField<LoginForm>
          name="email"
          label={t('auth.email')}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <FormField<LoginForm>
          name="password"
          label={t('auth.password')}
          secureTextEntry
        />
      </FormProvider>
      {login.isError ? (
        <Text style={{color: palette.error, marginBottom: spacing.md}}>{toErrorMessage(login.error)}</Text>
      ) : null}
      <Button title={t('common.signIn')} onPress={onSubmit} loading={login.isPending} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flexGrow: 1, justifyContent: 'center'},
});
