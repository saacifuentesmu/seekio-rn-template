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
import {useSignUp} from '@/hooks/auth/useSignUp';
import {AuthStackParamList} from '@/navigation/types';
import {useTheme} from '@/theme/ThemeProvider';
import {toErrorMessage} from '@/utils/errors';

interface SignUpForm {
  email: string;
  password: string;
  passwordConfirm: string;
}

export const SignUpScreen: React.FC = () => {
  const {t} = useTranslation();
  const {palette, spacing, typography} = useTheme();
  const nav = useNavigation<NativeStackNavigationProp<AuthStackParamList, 'SignUp'>>();
  const signUp = useSignUp();

  const schema = yup.object({
    email: yup.string().required(t('auth.emailRequired')).email(t('auth.emailInvalid')),
    password: yup.string().required(t('auth.passwordRequired')).min(8, t('auth.passwordMinLength')),
    passwordConfirm: yup
      .string()
      .required(t('auth.passwordRequired'))
      .oneOf([yup.ref('password')], t('auth.passwordsMustMatch')),
  });

  const methods = useForm<SignUpForm>({
    resolver: yupResolver(schema),
    defaultValues: {email: '', password: '', passwordConfirm: ''},
  });

  const onSubmit = methods.handleSubmit(data => signUp.mutate({email: data.email, password: data.password}));

  return (
    <ScrollView contentContainerStyle={[styles.container, {padding: spacing.lg, backgroundColor: palette.background}]}>
      <Text style={[typography.h1, {color: palette.text, marginBottom: spacing.lg}]}>{t('appName')}</Text>
      <FormProvider {...methods}>
        <FormField<SignUpForm>
          name="email"
          label={t('auth.email')}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <FormField<SignUpForm>
          name="password"
          label={t('auth.password')}
          secureTextEntry
        />
        <FormField<SignUpForm>
          name="passwordConfirm"
          label={t('auth.passwordConfirm')}
          secureTextEntry
        />
      </FormProvider>
      {signUp.isError ? (
        <Text style={{color: palette.error, marginBottom: spacing.md}}>{toErrorMessage(signUp.error)}</Text>
      ) : null}
      <Button title={t('auth.signUp')} onPress={onSubmit} loading={signUp.isPending} />

      <Pressable onPress={() => nav.navigate('Login')} style={[styles.linkRow, {marginTop: spacing.lg}]}>
        <Text style={[typography.body, {color: palette.text, opacity: 0.6}]}>
          {t('auth.alreadyHaveAccount')}{' '}
        </Text>
        <Text style={[typography.body, {color: palette.primary}]}>{t('common.signIn')}</Text>
      </Pressable>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flexGrow: 1, justifyContent: 'center'},
  linkRow: {flexDirection: 'row', justifyContent: 'center', alignItems: 'center'},
});
