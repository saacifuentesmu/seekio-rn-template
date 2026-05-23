import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {Pressable, ScrollView, StyleSheet, Text} from 'react-native';
import * as yup from 'yup';

import {Button} from '@/components/UI/Button';
import {FormField} from '@/components/forms/FormField';
import {useForgotPassword} from '@/hooks/auth/useForgotPassword';
import {AuthStackParamList} from '@/navigation/types';
import {useTheme} from '@/theme/ThemeProvider';
import {toErrorMessage} from '@/utils/errors';

interface ForgotPasswordForm {
  email: string;
}

export const ForgotPasswordScreen: React.FC = () => {
  const {t} = useTranslation();
  const {palette, spacing, typography} = useTheme();
  const nav =
    useNavigation<
      NativeStackNavigationProp<AuthStackParamList, 'ForgotPassword'>
    >();
  const forgot = useForgotPassword();

  const schema = yup.object({
    email: yup
      .string()
      .required(t('auth.emailRequired'))
      .email(t('auth.emailInvalid')),
  });

  const methods = useForm<ForgotPasswordForm>({
    resolver: yupResolver(schema),
    defaultValues: {email: ''},
  });

  const onSubmit = methods.handleSubmit(data => forgot.mutate(data));

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        {padding: spacing.lg, backgroundColor: palette.background},
      ]}>
      <Text
        style={[
          typography.h1,
          {color: palette.text, marginBottom: spacing.lg},
        ]}>
        {t('screens.forgotPassword')}
      </Text>

      {forgot.isSuccess ? (
        <>
          <Text
            style={[
              typography.body,
              {color: palette.text, marginBottom: spacing.lg},
            ]}>
            {t('auth.resetLinkSent')}
          </Text>
          <Pressable
            onPress={() => nav.navigate('Login')}
            style={styles.linkRow}>
            <Text style={[typography.body, {color: palette.primary}]}>
              {t('auth.backToSignIn')}
            </Text>
          </Pressable>
        </>
      ) : (
        <>
          <FormProvider {...methods}>
            <FormField<ForgotPasswordForm>
              name="email"
              label={t('auth.email')}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </FormProvider>
          {forgot.isError ? (
            <Text style={{color: palette.error, marginBottom: spacing.md}}>
              {toErrorMessage(forgot.error)}
            </Text>
          ) : null}
          <Button
            title={t('auth.sendResetLink')}
            onPress={onSubmit}
            loading={forgot.isPending}
          />

          <Pressable
            onPress={() => nav.navigate('Login')}
            style={[styles.linkRow, {marginTop: spacing.lg}]}>
            <Text style={[typography.body, {color: palette.primary}]}>
              {t('auth.backToSignIn')}
            </Text>
          </Pressable>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flexGrow: 1, justifyContent: 'center'},
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
