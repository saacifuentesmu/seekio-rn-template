import {yupResolver} from '@hookform/resolvers/yup';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {FormProvider, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {Pressable, ScrollView, StyleSheet, Text, View} from 'react-native';
import * as yup from 'yup';

import {Button} from '@/components/UI/Button';
import {FormField} from '@/components/forms/FormField';
import {appConfig} from '@/constants/appConfig';
import {useGoogleLogin} from '@/hooks/auth/useGoogleLogin';
import {useLogin} from '@/hooks/auth/useLogin';
import {AuthStackParamList} from '@/navigation/types';
import {useTheme} from '@/theme/ThemeProvider';
import {toErrorMessage} from '@/utils/errors';

interface LoginForm {
  email: string;
  password: string;
}

export const LoginScreen: React.FC = () => {
  const {t} = useTranslation();
  const {palette, spacing, typography} = useTheme();
  const nav =
    useNavigation<NativeStackNavigationProp<AuthStackParamList, 'Login'>>();
  const login = useLogin();
  const google = useGoogleLogin();

  const schema = yup.object({
    email: yup
      .string()
      .required(t('auth.emailRequired'))
      .email(t('auth.emailInvalid')),
    password: yup.string().required(t('auth.passwordRequired')),
  });

  const methods = useForm<LoginForm>({
    resolver: yupResolver(schema),
    defaultValues: {email: '', password: ''},
  });

  const onSubmit = methods.handleSubmit(data => login.mutate(data));

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
        {t('appName')}
      </Text>
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
      <Pressable
        onPress={() => nav.navigate('ForgotPassword')}
        style={[styles.linkRow, {marginBottom: spacing.md}]}>
        <Text style={[typography.body, {color: palette.primary}]}>
          {t('auth.forgotPassword')}
        </Text>
      </Pressable>
      {login.isError ? (
        <Text style={{color: palette.error, marginBottom: spacing.md}}>
          {toErrorMessage(login.error)}
        </Text>
      ) : null}
      <Button
        title={t('common.signIn')}
        onPress={onSubmit}
        loading={login.isPending}
      />

      <Pressable
        onPress={() => nav.navigate('SignUp')}
        style={[styles.linkRow, {marginTop: spacing.md}]}>
        <Text
          style={[typography.body, styles.mutedText, {color: palette.text}]}>
          {t('auth.dontHaveAccount')}{' '}
        </Text>
        <Text style={[typography.body, {color: palette.primary}]}>
          {t('auth.signUp')}
        </Text>
      </Pressable>

      {appConfig.googleSignIn.webClientId ? (
        <>
          <View style={[styles.dividerRow, {marginVertical: spacing.lg}]}>
            <View
              style={[styles.dividerLine, {backgroundColor: palette.border}]}
            />
            <Text
              style={[
                typography.body,
                styles.mutedText,
                {color: palette.text, marginHorizontal: spacing.md},
              ]}>
              {t('auth.or')}
            </Text>
            <View
              style={[styles.dividerLine, {backgroundColor: palette.border}]}
            />
          </View>

          <Button
            title={t('auth.continueWithGoogle')}
            variant="secondary"
            onPress={google.signIn}
            loading={google.isPending}
            disabled={google.isPending}
          />
          {google.error ? (
            <Text style={{color: palette.error, marginTop: spacing.sm}}>
              {t('auth.googleSignInFailed')}
            </Text>
          ) : null}
        </>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flexGrow: 1, justifyContent: 'center'},
  dividerRow: {flexDirection: 'row', alignItems: 'center'},
  dividerLine: {flex: 1, height: StyleSheet.hairlineWidth},
  mutedText: {opacity: 0.6},
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
